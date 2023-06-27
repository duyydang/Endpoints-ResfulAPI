const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

// Khởi tạo Express app
const app = express();

// Cấu hình body-parser để xử lý phần thân yêu cầu HTTP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cấu hình kết nối SQL Server
const dbConfig = {
  user: '******',
  password: '*******',
  server: '*******',
  database: '******',
  port: 9898, // Chỉnh sửa cổng tại đây
  options: {
    encrypt: false, // Nếu sử dụng kết nối mã hóa SSL
  },
};

// API endpoint để lấy danh sách nhân viên
app.get('/employees', (req, res) => {
  // Kết nối tới SQL Server
  sql.connect(dbConfig, (err) => {
    if (err) {
      console.log('Lỗi kết nối SQL Server:', err);
      res.status(500).send('Lỗi kết nối SQL Server');
      return;
    }

    // Thực hiện truy vấn để lấy danh sách nhân viên
    const query = 'select UserID,UserName from SYSUser';
    new sql.Request().query(query, (err, result) => {
      if (err) {
        console.log('Lỗi truy vấn SQL:', err);
        res.status(500).send('Lỗi truy vấn SQL');
        return;
      }

      // Lọc dữ liệu nếu có tên lọc được truyền vào
      const nameFilter = req.query.UserID;
      if (nameFilter) {
        const filteredEmployees = result.recordset.filter(employee => employee.UserID === nameFilter);
        res.json(filteredEmployees);
      } else {
        res.json(result.recordset);
      }
    });
  });
});

// Khởi chạy server
const port = 3000;
app.listen(port, () => {
  console.log('Backend server đang chạy trên cổng', port);
});
