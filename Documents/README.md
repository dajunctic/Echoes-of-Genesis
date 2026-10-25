# TRUNG TÂM TÀI LIỆU DỰ ÁN GAME (MASTER DESIGN DOCUMENTS)
**Dự án:** Echoes of Genesis - Dư Âm Khởi Nguyên  
**Thể loại:** Dual-Gameplay: 2.5D Isometric MMORPG Cày Cuốc x Auto-Battler Gacha Spine 2D  
**Phong cách:** Siêu hỗn hợp Đông - Tây (Tu Tiên Cảnh Giới, Kiếm Hiệp Ngự Kiếm x Ma Pháp Grimoire, Hiệp Sĩ Giáo Đình)  
**Công nghệ:** TypeScript, Phaser 3, Node.js + WebSocket, Spine 2D Runtime, WebGL Shader  

---

## 📚 DANH MỤC 12 TÀI LIỆU THIẾT KẾ CHI TIẾT

Toàn bộ tài liệu thiết kế và đặc tả kỹ thuật của dự án được lưu trữ trực tiếp trong thư mục này (`Documents/`):

### 🌟 [00_THUONG_HIEU_VA_TEN_GAME.md](./00_THUONG_HIEU_VA_TEN_GAME.md)
* **Nội dung:** 
  * Hồ sơ thương hiệu chính thức: **Echoes of Genesis** (Tiếng Anh) & **Dư Âm Khởi Nguyên** (Tiếng Việt).
  * Ý nghĩa tên gọi, định vị sản phẩm, các câu khẩu hiệu (Slogans / Taglines) truyền thông.
  * Bảng màu thương hiệu (Brand Color Palette) và định hướng logo, chiến lược tên miền.

### 📖 [01_COT_TRUYEN_THE_GIOI.md](./01_COT_TRUYEN_THE_GIOI.md)
* **Nội dung:** 
  * Biên niên sử "Thiên Địa Quy Nhất" (The Convergence) sáp nhập cõi Tây Huyễn Astraea và Thương Khung Vực Đông Phương.
  * 4 Đại Trận Doanh: Tiên Môn Kiếm Tông, Ma Đạo Cổ Tộc, Thần Thánh Giáo Đình, Hư Không Yêu Tộc.
  * Thân thế Kẻ Thức Tỉnh Song Tu và tuyến nhiệm vụ chính qua các cảnh giới (Cấp 1 - 65).
  * Bản đồ phân tầng thế giới 20 Channels.

### 🎮 [02_TINH_NANG_GAMEPLAY_CORE.md](./02_TINH_NANG_GAMEPLAY_CORE.md)
* **Nội dung:** 
  * Hệ thống 12 Trụ cột tính năng chi tiết:
    1. Ấn Ký Nguyên Tố Bẩm Sinh (Roll 6 hệ, thưởng đồng hệ 30%, NPC Tẩy Mệnh).
    2. Sách Phép Grimoire & Cây kỹ năng 4 tầng phân nhánh A/B, hệ thống Affix ngẫu nhiên.
    3. Farm Quái & Phân bổ 4 chỉ số Tiềm Năng (STR/INT/DEX/VIT), cơ chế Auto-Grind.
    4. Săn Boss Dã Ngoại phân 20 Khu (Channel), World Broadcast, **Khóa bảo vệ rương 30s & Cướp đồ tự do**.
    5. Lò rèn Cường Hóa +15, rủi ro tụt/vỡ và **Hào quang vũ khí phát sáng 5 cấp bậc**.
    6. Kinh tế Chợ Trời: **Quy tắc Unbound 100% đồ Boss**, Mở sạp dã ngoại, Giao dịch P2P 2 bước.
    7. Chiến đấu PK Thế Giới: 3 Cờ (Trắng, Đỏ, Bang), Điểm tội ác, Tên Đỏ chết rơi vàng và 50% nguy cơ rớt đồ.
    8. Tổ đội 4 người (+10% EXP/người) và Sự kiện Công Thành Vực Đá Quý chiếm 5% thuế chợ trời.
    9. **Hệ Thống Cảnh Giới Tu Tiên & Đột Phá Lôi Kiếp** (Luyện Khí -> Trúc Cơ Ngự Kiếm -> Kim Đan -> Nguyên Anh Bất Tử).
    10. **Gameplay B: Auto-Battler 5v5 Spine 2D** & Đài Triệu Hoán Gacha Thái Hư.
    11. **Cơ Chế Liên Thông Dual-Gameplay:** Kỹ năng Trợ Chiến Striker Call và Duyên Phận Buff % Lực Chiến.
    12. Các Chế Độ Phụ Bản Đội Hình Tướng Spine (Tháp Hư Không 100 tầng, Spine Arena, Viễn Chinh Roguelike).

### 📐 [03_CONG_THUC_VA_CAN_BANG_CHI_SO.md](./03_CONG_THUC_VA_CAN_BANG_CHI_SO.md)
* **Nội dung:** 
  * Toàn bộ công thức toán học chiến đấu: Giáp, Kháng phép, Né đòn, Bạo kích, Đồng điệu nguyên tố.
  * Bảng tỷ lệ quy đổi 4 Điểm Tiềm Năng (STR, INT, DEX, VIT).
  * Đường cong kinh nghiệm (EXP Curve) chuẩn mực từ Cấp 1 đến 65.
  * Bảng chỉ số quái thường, Ma Thú Bạo Chúa và Cổ Thần.
  * Mô hình xác suất Cường hóa +1 đến +15 và bảng trọng số Affix RNG.

### 🗓️ [04_KE_HOACH_PHAT_TRIEN_THEO_NGAY.md](./04_KE_HOACH_PHAT_TRIEN_THEO_NGAY.md)
* **Nội dung:** 
  * Lộ trình Sprint 35 Ngày (5 Tuần) tăng tốc từ con số 0 đến ngày Deploy chạy thử nghiệm:
    * Tuần 1: Móng Engine, Client/Server, Bản đồ Isometric & Di chuyển 8 hướng mượt mà.
    * Tuần 2: AI Quái vật, Tính sát thương, Damage Popup Text, VFX hạt ma pháp & Rơi đồ.
    * Tuần 3: Túi đồ 40 ô, Sách Phép, Lễ Thức Tỉnh Cấp 10, Điểm tiềm năng & Auto-Grind.
    * Tuần 4: 20 Channels, Boss dã ngoại, Bảng Top Damage, Rương 30s & Tranh cướp đồ.
    * Tuần 5: Lò rèn +15, GLSL Shader hào quang vũ khí, Mở sạp chợ trời & Trade P2P.
    * Tuần 6: Cờ đỏ PK, Công thành bang hội, Tối ưu hóa WebGL 12MB & Deploy Online.

### 🏗️ [05_KIEN_TRUC_HE_THONG_VA_CODE_STRUCTURE.md](./05_KIEN_TRUC_HE_THONG_VA_CODE_STRUCTURE.md)
* **Nội dung:** 
  * Mô hình kiến trúc 4 tầng chuẩn Enterprise: **`contracts` - `data` (Model) - `logic` (Controller) - `view` (View)**.
  * Hệ thống Quản lý Popup Stack & ShowType.
  * Hệ thống Tiến Trình Khởi Động (Boot Phase Pipeline).
  * Hệ thống Đạn Đạo (`MissileSystem`) và Hiệu Ứng (`FxSystem`) Zero GC.
  * Hệ thống Đa Ngôn Ngữ (Localization - I18n).

### 💥 [06_HE_THONG_SKILL_FX_VA_MISSILE.md](./06_HE_THONG_SKILL_FX_VA_MISSILE.md)
* **Nội dung:** 
  * Danh mục Skill dựng sẵn cho 6 Bộ Cổ Thư (Hỏa, Băng, Lôi, Độc, Quang, Ám) đầy đủ 4 tầng kỹ năng.
  * Danh mục Skill dựng sẵn cho Quái thường & 5 Đại Ma Thú Bạo Chúa.
  * Bộ công cụ quản lý quỹ đạo đạn và hiệu ứng hạt GPU particle.

### 🎭 [07_KICH_BAN_HOI_THOAI_COT_TRUYEN.md](./07_KICH_BAN_HOI_THOAI_COT_TRUYEN.md)
* **Nội dung:** 
  * Kịch bản lời dẫn mở màn sử thi (Prologue Cinematic).
  * Lời thoại theo nhiệm vụ chính tuyến các chương (Gặp Vane, Vulcan, Miria, Silas, Tôn Lão Nhược, Tiêu Dao).
  * Kịch bản đột phá Lôi Kiếp Thiên Phạt (Sấm sét giáng lâm, cắn đan hộ thể).
  * Bộ Voice Lines độc quyền khi xuất trận và thi triển Tuyệt Kỹ Nộ của dàn tướng Spine 2D.
  * Bộ thông điệp loa chạy chữ toàn server (Boss xuất hiện, nổ hũ gacha UR, vinh danh +15).

### ⚔️ [08_TAI_NGUYEN_VA_THAM_KHAO_FLARE.md](./08_TAI_NGUYEN_VA_THAM_KHAO_FLARE.md)
* **Nội dung:**
  * Đánh giá chi tiết tài nguyên Flare Engine & Flare Game.
  * Khai thác Asset 2.5D Isometric 8 hướng (Spritesheets nhân vật, quái vật, tilesets).

### 🎨 [09_THIET_KE_TYPOGRAPHY_VA_UI_SYSTEM.md](./09_THIET_KE_TYPOGRAPHY_VA_UI_SYSTEM.md)
* **Nội dung:**
  * Hệ thống Font chữ phân cấp sử thi (Cinzel Decorative, Cinzel, Montserrat, Fira Code).
  * Bảng màu UI vàng kim hoàng gia kết hợp ma pháp huyền bí.
  * Quy chuẩn HUD, Action Hotbar, Popup Modal trên Web Desktop & Mobile Responsive.

### 🔮 [10_HE_THONG_TU_TIEN_VA_DANH_SACH_TUONG_GACHA.md](./10_HE_THONG_TU_TIEN_VA_DANH_SACH_TUONG_GACHA.md)
* **Nội dung:**
  * Bối cảnh "Thiên Địa Quy Nhất" dung hợp Tây Huyễn và Tu Tiên.
  * Chi tiết 6 Cảnh Giới Tu Tiên (Luyện Khí ➔ Trúc Cơ ➔ Kim Đan ➔ Nguyên Anh ➔ Hóa Thần ➔ Độ Kiếp).
  * Cơ chế Lôi Kiếp Thiên Phạt sấm sét toàn server.
  * Cơ chế Auto-Battler 5v5 Spine 2D (Side-view, thanh nộ 1000 điểm, cut-in animation).
  * Hệ thống Gacha Đài Triệu Hoán Thái Hư (Pity 10/60, thăng tinh 1 - 5 sao).
  * Cơ chế Trợ Chiến Striker Call và Duyên Phận Thuộc Tính.
  * **Hồ sơ chi tiết 16 Tướng Spine 2D** (Lý Tiêu Dao, Diệp Hắc, Jeanne d'Arc, Tiamat, Bạch Thiển, Merlin...) đầy đủ ngoại hình, kỹ năng, voice line và buff cho nhân vật chính.
  * 4 Chế độ chơi đội hình: Tháp Hư Không 100 tầng, Spine Arena, Viễn Chinh Roguelike, Săn Boss Cổ Thần 5v1.

### 📊 [GAME_DESIGN_DOCUMENT_AND_GRAPHICS_ANALYSIS.md](./GAME_DESIGN_DOCUMENT_AND_GRAPHICS_ANALYSIS.md)
* **Nội dung:**
  * Báo cáo phân tích chuyên sâu các phong cách đồ họa Web H5 (Full 3D, 2.5D Isometric 4/8/16 hướng, 2D Spine).
  * Đánh giá hiệu năng WebGL, RAM footprint và pipeline tích hợp asset AI.
  * So sánh kiến trúc mạng Multiplayer WebSocket.

---
*Mọi tài liệu đều sử dụng đường dẫn tương đối để dễ dàng xem và liên kết trực tiếp trên GitHub.*
