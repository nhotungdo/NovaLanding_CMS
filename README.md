<a name="readme-top"></a>

<div align="center">
  <h1 align="center">NovaLanding CMS</h1>

  <p align="center">
    <h3>AI-Powered Landing Page Builder</h3>
    <br />
    <em>Xây dựng Landing Page chuyên nghiệp trong vài giây với sức mạnh của Google Gemini AI</em>
    <br />
    <br />
    <a href="#view-demo">Xem Demo</a>
    ·
    <a href="#report-bug">Báo lỗi</a>
    ·
    <a href="#request-feature">Yêu cầu tính năng</a>
  </p>

  [![React][React.js]][React-url]
  [![Vite][Vite]][Vite-url]
  [![TypeScript][TypeScript]][TypeScript-url]
  [![TailwindCSS][TailwindCSS]][TailwindCSS-url]
</div>

<!-- MỤC LỤC -->
<details>
  <summary><strong>Mục lục</strong> (Nhấn để mở rộng)</summary>
  <ol>
    <li>
      <a href="#-giới-thiệu">Giới thiệu</a>
      <ul>
        <li><a href="#hình-ảnh-demo">Hình ảnh Demo</a></li>
      </ul>
    </li>
    <li><a href="#-công-nghệ-sử-dụng">Công nghệ sử dụng</a></li>
    <li>
      <a href="#-bắt-đầu">Bắt đầu</a>
      <ul>
        <li><a href="#yêu-cầu-tiên-quyết">Yêu cầu tiên quyết</a></li>
        <li><a href="#cài-đặt">Cài đặt</a></li>
      </ul>
    </li>
    <li><a href="#-hướng-dẫn-sử-dụng">Hướng dẫn sử dụng</a></li>
    <li><a href="#-lộ-trình-phát-triển">Lộ trình phát triển</a></li>
    <li><a href="#-đóng-góp">Đóng góp</a></li>
  </ol>
</details>

---

## 🚀 Giới thiệu

**NovaLanding CMS** là giải pháp Frontend hiện đại được thiết kế để dân chủ hóa việc tạo Landing Page. Không cần kiến thức lập trình, người dùng có thể tạo ra các trang web bán hàng, giới thiệu sản phẩm với giao diện tuyệt đẹp và nội dung chuẩn SEO.

Điểm khác biệt lớn nhất của NovaLanding chính là **AI Engine**:
*   **Tự động viết nội dung**: Nhập ngành hàng (VD: "Organic Coffee"), Gemini AI sẽ viết tiêu đề, mô tả, lợi ích sản phẩm...
*   **Tự động hóa hình ảnh**: Hệ thống tự tìm ảnh phù hợp từ Unsplash hoặc vẽ ảnh mới hoàn toàn nếu không tìm thấy.

### Hình ảnh Demo

*(Chưa cập nhật ảnh chụp màn hình - Hãy chạy dự án để trải nghiệm)*

<p align="right">(<a href="#readme-top">lên đầu trang</a>)</p>

## 🛠 Công nghệ sử dụng

Dự án được xây dựng trên nền tảng công nghệ web mới nhất để đảm bảo hiệu suất và trải nghiệm người dùng mượt mà:

*   [![React][React.js]][React-url] **React 19** - Thư viện UI Core.
*   [![Vite][Vite]][Vite-url] **Vite** - Build tool siêu tốc.
*   [![TypeScript][TypeScript]][TypeScript-url] **TypeScript** - Type safety.
*   **Google Gemini SDK** - Trí tuệ nhân tạo tạo sinh (Text & Image).
*   **Lucide React** - Bộ icon hiện đại, nhẹ nhàng.

<p align="right">(<a href="#readme-top">lên đầu trang</a>)</p>

## ⚡ Bắt đầu

Để chạy dự án này trên máy local của bạn, hãy làm theo các bước đơn giản sau.

### Yêu cầu tiên quyết

Đảm bảo bạn đã cài đặt các công cụ sau:
*   [Node.js](https://nodejs.org/) (Khuyên dùng v18 trở lên)
*   npm

### Cài đặt

1.  **Clone repository**
    ```sh
    git clone https://github.com/your-username/NovaLanding_CMS.git
    cd NovaLanding_CMS/NovaLanding_CMS
    ```

2.  **Cài đặt các gói thư viện (Packages)**
    ```sh
    npm install
    ```

3.  **Cấu hình biến môi trường (.env)**
    Tạo file `.env` ở thư mục gốc và điền API Key của bạn vào:
    ```env
    # Bắt buộc: Google AI Studio Key
    GEMINI_API_KEY=AIzaSy...

    # Bắt buộc: Unsplash Access Key (để tìm ảnh)
    VITE_UNSPLASH_ACCESS_KEY=Client-ID...
    ```

4.  **Khởi chạy dự án**
    ```sh
    npm run dev
    ```

<p align="right">(<a href="#readme-top">lên đầu trang</a>)</p>

## 📖 Hướng dẫn sử dụng

1.  Truy cập `http://localhost:3000` trên trình duyệt.
2.  **Bước 1: Nhập ý tưởng**. Ở thanh công cụ bên trái (Tab *Content*), nhập từ khóa ngành hàng của bạn vào ô "Niche/Topic".
3.  **Bước 2: Generate**. Nhấn nút "Generate with AI" và đợi khoảng 5-10 giây.
    *   AI sẽ điền nội dung vào các thẻ Hero, About, Features.
    *   Hệ thống sẽ tự động thay thế ảnh nền phù hợp.
4.  **Bước 3: Tinh chỉnh**.
    *   Chuyển sang Tab *Design* để đổi Font chữ, màu sắc chủ đạo.
    *   Bấm trực tiếp vào các Section trên màn hình Preview để chọn (Focus).
5.  **Bước 4: Preview**. Bấm nút "Preview" trên thanh Topbar để xem trang ở chế độ toàn màn hình hoặc giả lập "Mobile View".

<p align="right">(<a href="#readme-top">lên đầu trang</a>)</p>

## 🛣 Lộ trình phát triển

- [x] Tích hợp Google Gemini (Text Generation).
- [x] Tích hợp Unsplash Image Search.
- [x] Chế độ xem Mobile/Desktop.
- [x] Undo/Redo History.
- [ ] **Export HTML/CSS**: Xuất bản trang web thành file tĩnh.
- [ ] **Lưu Project**: Lưu cấu hình xuống Database/File.
- [ ] **Custom Section**: Cho phép thêm các Section tùy chỉnh mới.
- [ ] **SEO Settings**: Tùy chỉnh thẻ Meta Tags bằng AI.

<p align="right">(<a href="#readme-top">lên đầu trang</a>)</p>

## 🤝 Đóng góp

Mọi đóng góp đều luôn được hoan nghênh! Nếu bạn muốn cải thiện dự án này:

1.  Fork dự án
2.  Tạo Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`)
4.  Push lên Branch (`git push origin feature/AmazingFeature`)
5.  Mở một Pull Request

<p align="right">(<a href="#readme-top">lên đầu trang</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vite]: https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[TailwindCSS]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
