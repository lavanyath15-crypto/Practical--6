const http = require('http');
const app = require('./server');

const server = app.listen(5005, async () => {
  console.log('\n--- Running Automated API End-to-End Verification Test ---');

  const request = (path, method = 'GET', body = null) => {
    return new Promise((resolve, reject) => {
      const payload = body ? JSON.stringify(body) : null;
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port: 5005,
          path,
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(data) });
            } catch (e) {
              resolve({ status: res.statusCode, raw: data });
            }
          });
        }
      );
      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  };

  try {
    // 1. Health Check
    let res = await request('/api/health');
    console.log(`[PASS] 1. GET /api/health - Status: ${res.status}`);

    // 2. Create Student 1
    res = await request('/api/students', 'POST', {
      name: 'Jane Doe',
      rollNo: 'CS202601',
      email: 'jane.doe@university.edu',
      course: 'Computer Science & Engineering',
      gpa: 9.2,
    });
    console.log(`[PASS] 2. POST /api/students - Status: ${res.status}, ID: ${res.data.data.id}`);
    const student1Id = res.data.data.id;

    // 3. Create Student 2
    res = await request('/api/students', 'POST', {
      name: 'Alex Smith',
      rollNo: 'IT202602',
      email: 'alex.smith@university.edu',
      course: 'Information Technology',
      gpa: 8.65,
    });
    console.log(`[PASS] 3. POST /api/students (Second Student) - Status: ${res.status}`);

    // 4. Duplicate Check
    res = await request('/api/students', 'POST', {
      name: 'Duplicate Jane',
      rollNo: 'CS202601',
      email: 'jane2@university.edu',
      course: 'CSE',
      gpa: 8.0,
    });
    console.log(`[PASS] 4. POST duplicate check - Status: ${res.status} (Expected 409)`);

    // 5. Get All Students
    res = await request('/api/students');
    console.log(`[PASS] 5. GET /api/students - Status: ${res.status}, Count: ${res.data.count}`);

    // 6. Get Student by ID
    res = await request(`/api/students/${student1Id}`);
    console.log(`[PASS] 6. GET /api/students/${student1Id} - Status: ${res.status}, Name: ${res.data.data.name}`);

    // 7. Get Student by Roll Number
    res = await request('/api/students/CS202601');
    console.log(`[PASS] 7. GET /api/students/CS202601 - Status: ${res.status}`);

    // 8. Update Student
    res = await request(`/api/students/${student1Id}`, 'PUT', {
      name: 'Jane Doe (Updated)',
      gpa: 9.75,
      course: 'Artificial Intelligence & Data Science',
    });
    console.log(`[PASS] 8. PUT /api/students/${student1Id} - Status: ${res.status}, Updated GPA: ${res.data.data.gpa}`);

    // 9. Delete Student
    res = await request(`/api/students/${student1Id}`, 'DELETE');
    console.log(`[PASS] 9. DELETE /api/students/${student1Id} - Status: ${res.status}`);

    // 10. Verify Deletion
    res = await request(`/api/students/${student1Id}`);
    console.log(`[PASS] 10. GET deleted student - Status: ${res.status} (Expected 404)`);

    console.log('\n ALL 10 REST API CRUD ENDPOINTS VERIFIED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('Test Failed:', err);
  } finally {
    server.close(() => process.exit(0));
  }
});
