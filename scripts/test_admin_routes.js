async function run() {
  const urls = [
    '/admin',
    '/admin/products',
    '/admin/orders',
    '/admin/rfq',
    '/admin/customers',
    '/admin/pricing-shipping',
    '/admin/cms',
    '/admin/deals',
    '/admin/inquiries',
    '/admin/settings'
  ];

  console.log('Testing Admin Panel Routes:');
  for (const u of urls) {
    try {
      const res = await fetch('http://localhost:3000' + u);
      console.log(`[STATUS ${res.status}] ${u}`);
    } catch (e) {
      console.error(`[ERROR] ${u} -> ${e.message}`);
    }
  }
}

run();
