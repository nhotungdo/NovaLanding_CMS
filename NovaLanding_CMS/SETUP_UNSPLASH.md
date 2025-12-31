# Hướng dẫn cấu hình Unsplash API

## Tính năng mới: Tự động lấy ảnh phù hợp khi Generate Copy

Khi bạn sử dụng tính năng "Generate Copy", hệ thống sẽ tự động:
1. Tạo nội dung phù hợp với niche của bạn
2. **Tìm và chèn ảnh chất lượng cao từ Unsplash** phù hợp với nội dung
3. Nếu không tìm thấy ảnh phù hợp, sẽ fallback sang generate ảnh bằng AI

## Cách lấy Unsplash API Key (MIỄN PHÍ)

1. Truy cập: https://unsplash.com/developers
2. Đăng ký tài khoản (nếu chưa có)
3. Nhấn "New Application"
4. Chấp nhận điều khoản sử dụng
5. Điền thông tin ứng dụng:
   - Application name: "NovaLanding CMS"
   - Description: "Landing page builder with AI"
6. Copy **Access Key** 
7. Dán vào file `.env.local`:

```
VITE_UNSPLASH_ACCESS_KEY=your_access_key_here
```

## Giới hạn miễn phí
- 50 requests/giờ
- Đủ cho việc phát triển và sử dụng cá nhân

## Lưu ý
- Ảnh từ Unsplash có chất lượng cao hơn và nhanh hơn so với AI generation
- Hệ thống tự động chọn ảnh phù hợp dựa trên niche và loại section
- Nếu không cấu hình Unsplash, hệ thống vẫn hoạt động bằng AI generation
