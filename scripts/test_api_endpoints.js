async function testApis() {
  console.log('Testing Admin API Endpoints with Authentication:');

  // 1. Login
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@industrialedge.pk', password: 'admin123' })
  });

  const cookie = loginRes.headers.get('set-cookie');
  console.log(`[LOGIN] Status: ${loginRes.status}, Cookie: ${cookie ? 'Present' : 'None'}`);

  const endpoints = [
    '/api/auth/me',
    '/api/admin/stats',
    '/api/admin/products',
    '/api/admin/orders',
    '/api/admin/rfq',
    '/api/admin/customers',
    '/api/admin/pricing-shipping',
    '/api/admin/cms',
    '/api/admin/rbac',
    '/api/admin/settings',
    '/api/admin/deals',
    '/api/admin/inquiries'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch('http://localhost:3000' + ep, {
        headers: cookie ? { 'Cookie': cookie } : {}
      });
      const data = await res.json().catch(() => ({}));
      const itemCount = Array.isArray(data) ? data.length : (data.items ? data.items.length : (data.products ? data.products.length : 'OK'));
      console.log(`[STATUS ${res.status}] ${ep} (Result: ${itemCount})`);
    } catch (e) {
      console.error(`[ERROR] ${ep}: ${e.message}`);
    }
  }
}

testApis();
