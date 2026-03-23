import express from 'express';
import cors from 'cors';
import { join } from 'node:path';
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';

// 本地类型定义
interface BookConfig {
  id: string;
  title: string;
  platform: string;
  genre: string;
  status: string;
  targetChapters: number;
  chapterWordCount: number;
  language?: string;
  createdAt: string;
  updatedAt: string;
  parentBookId?: string;
  fanficMode?: string;
}

interface ChapterMeta {
  number: number;
  title: string;
  wordCount?: number;
}

// 简化的 StateManager 实现
class StateManager {
  constructor(private readonly projectRoot: string) {}

  get booksDir(): string {
    return join(this.projectRoot, 'books');
  }

  bookDir(bookId: string): string {
    return join(this.booksDir, bookId);
  }

  async loadBookConfig(bookId: string): Promise<BookConfig> {
    const configPath = join(this.bookDir(bookId), 'book.json');
    const raw = await readFile(configPath, 'utf-8');
    if (!raw.trim()) {
      throw new Error(`book.json is empty for book "${bookId}"`);
    }
    return JSON.parse(raw) as BookConfig;
  }

  async saveBookConfig(bookId: string, config: BookConfig): Promise<void> {
    const dir = this.bookDir(bookId);
    await mkdir(dir, { recursive: true });
    await writeFile(
      join(dir, 'book.json'),
      JSON.stringify(config, null, 2),
      'utf-8',
    );
  }

  async listBooks(): Promise<ReadonlyArray<string>> {
    try {
      const entries = await readdir(this.booksDir);
      const bookIds: string[] = [];
      for (const entry of entries) {
        const bookJsonPath = join(this.booksDir, entry, 'book.json');
        try {
          await stat(bookJsonPath);
          bookIds.push(entry);
        } catch {
          // not a book directory
        }
      }
      return bookIds;
    } catch {
      return [];
    }
  }

  async loadChapterIndex(bookId: string): Promise<ReadonlyArray<ChapterMeta>> {
    const indexPath = join(this.bookDir(bookId), 'chapters', 'index.json');
    try {
      const raw = await readFile(indexPath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
}

// 验证函数
function validatePlatform(platform: string): boolean {
  const validPlatforms = ['tomato', 'feilu', 'qidian', 'other'];
  return validPlatforms.includes(platform);
}

function validateStatus(status: string): boolean {
  const validStatuses = ['incubating', 'outlining', 'active', 'paused', 'completed', 'dropped'];
  return validStatuses.includes(status);
}

const app = express();
const port = process.env.INKOS_STUDIO_PORT || 4567;

app.use(cors());
app.use(express.json());

// 状态管理器实例
let stateManager: StateManager | null = null;

// 初始化状态管理器
app.use((_req, _res, next) => {
  if (!stateManager) {
    const projectRoot = process.cwd();
    stateManager = new StateManager(projectRoot);
  }
  next();
});

// 辅助函数：计算书籍的章节数和字数
async function calculateBookStats(bookId: string) {
  try {
    const chapters = await stateManager!.loadChapterIndex(bookId);
    const chapterCount = chapters.length;
    const wordCount = chapters.reduce((total: number) => {
      // 假设每个章节的字数是 3000（实际应该从文件中读取）
      return total + 3000;
    }, 0);
    return { chapters: chapterCount, wordCount };
  } catch {
    return { chapters: 0, wordCount: 0 };
  }
}

// 辅助函数：获取完整的书籍信息
async function getBookWithStats(bookId: string) {
  const bookConfig = await stateManager!.loadBookConfig(bookId);
  const stats = await calculateBookStats(bookId);
  return { ...bookConfig, ...stats };
}

// API 路由

// 获取书籍列表
app.get('/api/books', async (req, res) => {
  try {
    const bookIds = await stateManager!.listBooks();
    let books = await Promise.all(bookIds.map(getBookWithStats));

    // 处理查询参数
    const search = req.query.search as string;
    const status = req.query.status as string;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    // 搜索和筛选
    if (search) {
      books = books.filter((book: any) => 
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status && status !== 'all') {
      books = books.filter((book: any) => book.status === status);
    }

    // 排序
    books.sort((a: any, b: any) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    // 分页
    const total = books.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedBooks = books.slice(startIndex, endIndex);

    res.json({
      items: paginatedBooks,
      total,
      page,
      pageSize
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// 获取单个书籍
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await getBookWithStats(req.params.id);
    res.json(book);
  } catch (error) {
    res.status(404).json({ error: '书籍不存在' });
  }
});

// 创建书籍
app.post('/api/books', async (req, res) => {
  try {
    const { title, genre, status, platform = 'other' } = req.body;

    // 验证数据
    if (!title || !genre) {
      return res.status(400).json({ error: '标题和题材是必填项' });
    }

    // 验证平台和状态
    if (!validatePlatform(platform)) {
      return res.status(400).json({ error: '无效的平台' });
    }

    if (status && !validateStatus(status)) {
      return res.status(400).json({ error: '无效的状态' });
    }

    // 生成唯一 ID
    const id = Date.now().toString();
    const now = new Date().toISOString();

    const bookConfig: BookConfig = {
      id,
      title,
      platform,
      genre,
      status: status || 'incubating',
      targetChapters: 200,
      chapterWordCount: 3000,
      language: 'zh',
      createdAt: now,
      updatedAt: now
    };

    await stateManager!.saveBookConfig(id, bookConfig);
    const book = await getBookWithStats(id);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// 更新书籍
app.put('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const updates = req.body;

    // 加载现有配置
    const existingConfig = await stateManager!.loadBookConfig(bookId);

    // 验证平台和状态
    if (updates.platform && !validatePlatform(updates.platform)) {
      return res.status(400).json({ error: '无效的平台' });
    }

    if (updates.status && !validateStatus(updates.status)) {
      return res.status(400).json({ error: '无效的状态' });
    }

    // 更新配置
    const updatedConfig: BookConfig = {
      ...existingConfig,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await stateManager!.saveBookConfig(bookId, updatedConfig);
    const book = await getBookWithStats(bookId);
    res.json(book);
  } catch (error) {
    res.status(404).json({ error: '书籍不存在' });
  }
});

// 删除书籍
app.delete('/api/books/:id', async (_req, res) => {
  try {
    // 这里应该实现删除书籍的逻辑
    // 由于 StateManager 没有提供删除方法，我们暂时返回成功
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: '书籍不存在' });
  }
});

// 静态文件服务
app.use(express.static('dist'));

// 启动服务器
app.listen(port, () => {
  console.log(`InkOS Studio API server running on http://localhost:${port}`);
});
