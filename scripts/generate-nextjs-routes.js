import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route configuration based on the analyzed structure
const routes = {
  insight: {
    pages: ['search', 'consumer-voice', 'videos', 'viral-analysis'],
    defaultPage: 'search'
  },
  testing: {
    pages: ['ideation', 'execution', 'performance', 'refinement'],
    defaultPage: 'ideation'
  },
  kol: {
    pages: ['dashboard', 'overview', 'conversion', 'detail/[id]'],
    defaultPage: 'dashboard'
  },
  ads: {
    pages: ['audience', 'distribution', 'optimization', 'tracking'],
    defaultPage: 'audience'
  },
  private: {
    pages: ['edm', 'linkedin', 'shopify', 'whatsapp', 'offline-stores'],
    defaultPage: 'edm'
  }
};

// Page mapping from old structure to new
const pageMapping = {
  'search': 'SearchInsights',
  'consumer-voice': 'ConsumerVoice',
  'videos': 'VideoInsights',
  'viral-analysis': 'ViralAnalysis',
  'ideation': 'Ideation',
  'execution': 'Execution',
  'performance': 'Performance',
  'refinement': 'Refinement',
  'dashboard': 'DashboardPage',
  'overview': 'OverviewPage',
  'conversion': 'ConversionPage',
  'detail/[id]': 'DetailPage',
  'audience': 'Audience',
  'distribution': 'Distribution',
  'optimization': 'Optimization',
  'tracking': 'Tracking',
  'edm': 'EDM',
  'linkedin': 'LinkedIn',
  'shopify': 'Shopify',
  'whatsapp': 'WhatsApp',
  'offline-stores': 'OfflineStores'
};

// Generate route files
function generateRoutes() {
  Object.entries(routes).forEach(([module, config]) => {
    // Create module directory
    const moduleDir = path.join(__dirname, '..', 'app', '(protected)', module);
    fs.mkdirSync(moduleDir, { recursive: true });

    // Create layout.tsx for module
    const layoutContent = `import { redirect } from 'next/navigation';

export default function ${module.charAt(0).toUpperCase() + module.slice(1)}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}`;

    fs.writeFileSync(path.join(moduleDir, 'layout.tsx'), layoutContent);

    // Create module index page that redirects to default
    const indexContent = `import { redirect } from 'next/navigation';

export default function ${module.charAt(0).toUpperCase() + module.slice(1)}Page() {
  redirect('/${module}/${config.defaultPage}');
}`;

    fs.writeFileSync(path.join(moduleDir, 'page.tsx'), indexContent);

    // Create sub-pages
    config.pages.forEach(page => {
      const pagePath = page.includes('[id]') ? page.replace('[id]', '[id]') : page;
      const pageDir = path.join(moduleDir, ...pagePath.split('/'));
      fs.mkdirSync(pageDir, { recursive: true });

      const componentName = pageMapping[page] || page;
      const importPath = module === 'kol' && page.includes('detail') 
        ? `@/pages/kol/DetailPage`
        : `@/pages/${module}/${componentName}`;

      const pageContent = `import dynamic from 'next/dynamic';

const ${componentName} = dynamic(() => import('${importPath}'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">加载中...</div>
});

export default function Page() {
  return <${componentName} />;
}`;

      fs.writeFileSync(path.join(pageDir, 'page.tsx'), pageContent);
    });
  });
}

// Generate API routes structure
function generateAPIRoutes() {
  const apiModules = ['insight', 'testing', 'kol', 'ads', 'private', 'video', 'database'];
  
  apiModules.forEach(module => {
    const apiDir = path.join(__dirname, '..', 'app', 'api', module);
    fs.mkdirSync(apiDir, { recursive: true });

    // Create route.ts for each API module
    const routeContent = `import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'data', 'tribit.db'), { readonly: true });

export async function GET(request: NextRequest) {
  try {
    // TODO: Migrate specific ${module} API logic here
    return NextResponse.json({ message: '${module} API endpoint' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Migrate specific ${module} POST logic here
    return NextResponse.json({ message: '${module} POST endpoint', data: body });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}`;

    fs.writeFileSync(path.join(apiDir, 'route.ts'), routeContent);
  });
}

// Run generation
console.log('Generating Next.js routes...');
generateRoutes();
generateAPIRoutes();
console.log('Routes generated successfully!');