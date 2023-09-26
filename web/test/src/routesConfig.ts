export default [
  {
    path: '/',
    component: 'page.tsx',
    layout: 'layout.tsx',
    load: 'api/load.ts',
    action: 'api/action.ts',
    seo: 'api/seo.ts',
    error: 'error.tsx',
    loading: 'loading.tsx',
    children: [
      {
        path: 'about',
        component: '+about/page.tsx',
        load: '+about/api/load.ts',
        action: '+about/api/action.ts',
        seo: '+about/api/seo.ts',
      },
      {
        path: 'home',
        component: '+home/page.tsx',
        layout: '+home/layout.tsx',
        load: '+home/api/load.ts',
        seo: '+home/api/seo.ts',
        loading: '+home/loading.tsx',
      },
      {
        path: 'products',
        component: '+products/page.tsx',
        layout: '+products/layout.tsx',
        load: '+products/api/load.ts',
        action: '+products/api/action.ts',
        seo: '+products/api/seo.ts',
        layoutOverride: '+products/!layout.tsx',
        children: [
          {
            path: 'categories',
            component: '+products/+categories/page.tsx',
            layout: '+products/+categories/layout.tsx',
            children: [
              {
                path: 'clothing',
                component: '+products/+categories/+clothing/page.tsx',
                layout: '+products/+categories/+clothing/layout.tsx',
                children: [
                  {
                    path: 'electronics',
                    component: '+products/+categories/+clothing/+electronics/page.tsx',
                    layout: '+products/+categories/+clothing/+electronics/layout.tsx',
                    load: '+products/+categories/+clothing/+electronics/api/load.ts',
                    action: '+products/+categories/+clothing/+electronics/api/action.ts',
                    seo: '+products/+categories/+clothing/+electronics/api/seo.ts',
                  },
                ],
              },
              {
                path: ':name',
                component: '+products/+categories/+[name]/page.tsx',
              },
            ],
          },
          {
            path: ':id',
            component: '+products/+[id]/page.tsx',
          },
        ],
      },
      {
        path: 'profiles',
        component: '+profiles/page.tsx',
      },
      {
        path: 'users',
        component: '+users/page.tsx',
      },
      {
        path: 'yeet',
        component: '+yeet/page.tsx',
      },
    ],
  },
];