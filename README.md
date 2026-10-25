# ⚔️ ECHOES OF GENESIS (ASTRAEA ONLINE) - DAY 1 PROTOTYPE

**Thể loại:** Web MMORPG 2.5D Isometric 8 Hướng (Vibe Võ Lâm Truyền Kỳ / Diablo)  
**Công nghệ:** Phaser 3, TypeScript, Vite, Node.js WebSocket Server (20Hz State Sync)

---

## 🚀 HƯỚNG DẪN KHỞI ĐỘNG NHANH TRÊN MÁY TÍNH

### Cách 1: Bấm trực tiếp file tiện ích
- Nhấp đúp chuột vào file **`run-dev.bat`** tại thư mục gốc của dự án. Hệ thống sẽ tự động cài đặt thư viện và khởi chạy đồng thời Client và Server.

### Cách 2: Chạy bằng Terminal / Command Line
1. Cài đặt các gói thư viện:
   ```bash
   npm install
   ```
2. Khởi chạy đồng thời cả Server và Client:
   ```bash
   npm run dev
   ```
   - **Web Game Client:** `http://localhost:3000` (hoặc `http://<IP-máy-bạn>:3000` để điện thoại trong cùng mạng Wi-Fi vào chơi)
   - **Multiplayer Server:** `ws://localhost:2567` (cổng 2567)

---

## 🎮 TÍNH NĂNG ĐÃ HOÀN THIỆN TRONG NGÀY 1

1. **Bản đồ 2.5D Isometric Diamond Grid (64x32 px):**
   - Lưới ô chuẩn Diamond, hỗ trợ chuyển đổi mượt mà giữa Cartesian logic $(x, y)$ và Isometric màn hình $(isoX, isoY)$.
   - Thuật toán sắp xếp chiều sâu Z-Depth Sorting chống lỗi đè hình vật cản.
2. **Nhân vật & Hoạt ảnh 8 Hướng (Diablo/Flare style):**
   - Đầy đủ 8 góc nhìn la bàn: `S`, `SW`, `W`, `NW`, `N`, `NE`, `E`, `SE`.
   - 2 chuỗi hoạt ảnh mượt mà: `Idle` (thở nhịp nhàng) và `Walk` (bước chân di chuyển, áo choàng bay, vung kiếm).
3. **Cơ chế điều khiển Hybrid (Đa nền tảng PC & Mobile Web):**
   - **PC:** Click chuột trái/phải di chuyển tự động (có vòng tròn hiệu ứng chỉ định đích đến) hoặc dùng phím **W-A-S-D / Phím Mũi Tên**.
   - **Mobile (iOS Safari / Android Chrome):** Tích hợp sẵn **Virtual Joystick cảm ứng** chạm kéo mượt mà.
4. **Đồng bộ Multiplayer thời gian thực (WebSocket 20Hz):**
   - Server phát sóng đồng bộ trạng thái 20 lần/giây (`sync_state`).
   - Client sử dụng cơ chế nội suy tuyến tính (Linear Interpolation - Lerp) giúp các người chơi khác di chuyển siêu mượt 60 FPS, không giật lag.
   - Nhận diện hệ nguyên tố bẩm sinh và đổi màu vòng sáng chân theo từng người chơi.
5. **HUD & Hệ thống Chat dã ngoại:**
   - Hiển thị trực tiếp: Tọa độ nhân vật $(x, y)$, Hướng quay mặt, Độ trễ mạng (Ping ms), Tốc độ khung hình (FPS), Số lượng người chơi đang Online.
   - Khung chat trực tiếp gõ Enter gửi tin nhắn tức thời toàn phòng.
6. **Màn Hình Load Game Sử Thi (Cinematic Preload Scene):**
   - Vòng tròn ma pháp Cổ Thư (Grimoire Seal) xoay phát sáng nhịp thở huyền bí giữa các chòm sao.
   - Thanh tiến trình nạp 5 Giai đoạn mượt mà (System Config -> Grimoire Master Data -> Flare Game Asset Preload -> Channel 1 Room -> Enter World).
   - Vòng quay mẹo chơi game & trích đoạn sử thi biến cố Đại Sụp Đổ tự động đổi sau mỗi 3.5s.
   - Nút tương tác vàng kim "⚡ TIẾN VÀO ĐẠI LỤC ASTRAEA" với hiệu ứng Camera Fade-Out.
7. **Tích hợp Tài Nguyên Đồ Họa Flare Game & Thanh Kỹ Năng (Action Hotbar):**
   - Script tự động tải bộ Tileset cỏ/ngục tối, Icons trang bị và Monster Sprites từ GitHub `flareteam/flare-game`.
   - Bù nhìn quái vật Skeleton đứng dã ngoại trong làng, có thanh máu đỏ và hiệu ứng chém trúng giật lùi kèm Floating Text `-25 HP`.
   - Thanh phím tắt Hotbar 4 ô ở đáy màn hình: [1] Trảm Thần Kiếm, [2] Bình Máu +50 HP, [3] Bình Mana +30 MP, [4] Cổ Thư Bộc Phát sóng xung kích Nova.

---


## 🌐 HƯỚNG DẪN HOST ONLINE CHO VIEWER TEST NGAY HÔM NAY

Để người xem ở bất kỳ đâu bấm vào link là vào cùng map thấy nhau ngay lập tức:

### Cách 1: Dùng Cloudflare Tunnel / ngrok (Phát trực tiếp từ máy bạn trong 1 phút)
1. Cài đặt `ngrok` hoặc `cloudflared`.
2. Mở cổng web client và server:
   ```bash
   # Nếu dùng ngrok
   ngrok http 3000
   ```
3. Gửi link `https://xxxx.ngrok-free.app` cho viewer vào test ngay trên điện thoại hoặc máy tính!

### Cách 2: Deploy lên Vercel + Render (Miễn phí 100%, link vĩnh viễn)
1. **Frontend:** Kết nối GitHub repo với **Vercel** (chọn thư mục root là `client/`, build command: `npm run build`, output: `dist`).
2. **Backend:** Deploy thư mục `server/` lên **Render.com** (Web Service Node.js).
3. Trong `client/src/network/NetworkManager.ts`, trỏ URL WebSocket về link wss của Render.
