export async function handlePrivacy(): Promise<Response> {
  return new Response(`<!DOCTYPE html>
  <html lang="vi">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Chính sách bảo mật của LuxeStart</title>
  </head>
  <body>
      <h1>Chính sách bảo mật của LuxeStart</h1>
      <p><strong>Cập nhật lần cuối: 28/02/2025</strong></p>

      <p>Chào mừng bạn đến với LuxeStart! Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và đảm bảo rằng thông tin cá nhân của bạn được xử lý một cách an toàn và minh bạch. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn khi bạn sử dụng extension LuxeStart.</p>

      <h2>1. Thông tin chúng tôi thu thập</h2>
      <p>LuxeStart <strong>không thu thập bất kỳ thông tin cá nhân nào</strong> từ người dùng. Extension hoạt động hoàn toàn trên thiết bị của bạn và không gửi dữ liệu đến bất kỳ máy chủ nào.</p>

      <h3>1.1. Dữ liệu lưu trữ cục bộ</h3>
      <ul>
          <li>LuxeStart sử dụng <strong>local storage</strong> của trình duyệt để lưu trữ dữ liệu như danh sách công việc, cài đặt người dùng và hình ảnh nền tùy chỉnh.</li>
          <li>Dữ liệu này chỉ được lưu trữ trên thiết bị của bạn và không được chia sẻ với bên thứ ba.</li>
      </ul>

      <h3>1.2. Quyền truy cập</h3>
      <ul>
          <li><strong>storage</strong>: Để lưu trữ dữ liệu cục bộ trên trình duyệt của bạn.</li>
          <li><strong>tabs</strong>: Để mở các tab mới khi bạn sử dụng tính năng tab tùy chỉnh.</li>
          <li><strong>sidePanel</strong>: Để hiển thị giao diện bảng điều khiển bên cạnh (nếu có).</li>
      </ul>

      <h2>2. Cách chúng tôi sử dụng thông tin</h2>
      <ul>
          <li><strong>Dữ liệu lưu trữ cục bộ</strong>: Được sử dụng để cung cấp trải nghiệm người dùng liền mạch, chẳng hạn như lưu lại danh sách công việc và cài đặt của bạn.</li>
          <li><strong>Quyền truy cập</strong>: Chỉ được sử dụng để thực hiện các chức năng cơ bản của extension, như mở tab mới hoặc hiển thị bảng điều khiển.</li>
      </ul>

      <h2>3. Chia sẻ thông tin</h2>
      <p>LuxeStart <strong>không chia sẻ thông tin cá nhân</strong> của bạn với bất kỳ bên thứ ba nào. Tất cả dữ liệu được lưu trữ cục bộ trên thiết bị của bạn và không được truyền đi nơi khác.</p>

      <h2>4. Bảo mật thông tin</h2>
      <p>Chúng tôi sử dụng các biện pháp bảo mật tiêu chuẩn để đảm bảo rằng dữ liệu của bạn được bảo vệ khỏi truy cập trái phép, sửa đổi hoặc tiết lộ. Tuy nhiên, hãy lưu ý rằng không có phương pháp truyền tải hoặc lưu trữ điện tử nào là hoàn toàn an toàn.</p>

      <h2>5. Quyền của bạn</h2>
      <p>Bạn có toàn quyền kiểm soát dữ liệu của mình. Bạn có thể:</p>
      <ul>
          <li>Xóa dữ liệu lưu trữ cục bộ bằng cách xóa extension khỏi trình duyệt.</li>
          <li>Tắt quyền truy cập của extension thông qua cài đặt trình duyệt.</li>
      </ul>

      <h2>6. Thay đổi chính sách bảo mật</h2>
      <p>Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Nếu có thay đổi đáng kể, chúng tôi sẽ thông báo cho bạn thông qua extension hoặc trang web của chúng tôi.</p>

      <h2>7. Liên hệ</h2>
      <p>Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về Chính sách bảo mật này, vui lòng liên hệ với chúng tôi tại:</p>
      <p><strong>Email</strong>: <a href="mailto:nguyentrunghieutcu@gmail.com">nguyentrunghieutcu@gmail.com</a></p>
 
      <p>Bằng cách sử dụng LuxeStart, bạn đồng ý với các điều khoản của Chính sách bảo mật này. Cảm ơn bạn đã tin tưởng và sử dụng LuxeStart!</p>
  </body>
  </html>`, {
    headers: { "Content-Type": "text/html; charset=UTF-8" }
  });
}
