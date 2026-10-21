# TRUNG TÂM TÀI LIỆU DỰ ÁN GAME (MASTER DESIGN DOCUMENTS)
**Dự án:** Echoes of Genesis - Dư Âm Khởi Nguyên  
**Thể loại:** 2.5D Isometric MMORPG Web H5 (Vibe Võ Lâm Truyền Kỳ / Diablo cày cuốc)  
**Công nghệ:** TypeScript, Phaser 3, Node.js + Colyseus, WebSocket, WebGL Shader  

---

## DANH MỤC 8 TÀI LIỆU THIẾT KẾ CHI TIẾT

Toàn bộ tài liệu thiết kế và đặc tả kỹ thuật của dự án đã được chuẩn hóa và phân chia khoa học thành 8 tài liệu độc lập:

### 🌟 [00_THUONG_HIEU_VA_TEN_GAME.md](file:///c:/Projects/Game%20Online/Documents/00_THUONG_HIEU_VA_TEN_GAME.md)
* **Nội dung:** 
  * Hồ sơ thương hiệu chính thức: **Echoes of Genesis** (Tiếng Anh) & **Dư Âm Khởi Nguyên** (Tiếng Việt).
  * Ý nghĩa tên gọi, định vị sản phẩm, các câu khẩu hiệu (Slogans / Taglines) truyền thông.
  * Bảng màu thương hiệu (Brand Color Palette) và định hướng logo, chiến lược tên miền.

### 📖 [01_COT_TRUYEN_THE_GIOI.md](file:///c:/Projects/Game%20Online/Documents/01_COT_TRUYEN_THE_GIOI.md)
* **Nội dung:** 
  * Biên niên sử Đại lục Astraea, biến cố Đại Sụp Đổ giải phóng Hư Không.
  * Quá trình quái vật nuốt tàn trang biến dị thành Ma Thú Bạo Chúa (Field Boss).
  * Chi tiết tuyến nhiệm vụ chính tuyến qua 4 Chương (Cấp 1 đến Cấp 60).
  * Dàn NPC trọng yếu và bản đồ phân tầng thế giới.

### 🎮 [02_TINH_NANG_GAMEPLAY_CORE.md](file:///c:/Projects/Game%20Online/Documents/02_TINH_NANG_GAMEPLAY_CORE.md)
* **Nội dung:** 
  * Hệ thống 8 Trụ cột tính năng chi tiết:
    1. Ấn Ký Nguyên Tố Bẩm Sinh (Roll 6 hệ, thưởng đồng hệ 30%, NPC Tẩy Mệnh).
    2. Sách Phép Grimoire & Cây kỹ năng 4 tầng phân nhánh A/B, hệ thống Affix ngẫu nhiên.
    3. Farm Quái & Phân bổ 4 chỉ số Tiềm Năng (STR/INT/DEX/VIT), cơ chế Auto-Grind.
    4. Săn Boss Dã Ngoại phân 20 Khu (Channel), World Broadcast, **Khóa bảo vệ rương 30s & Cướp đồ tự do**.
    5. Lò rèn Cường Hóa +15, rủi ro tụt/vỡ và **Hào quang vũ khí phát sáng 5 cấp bậc**.
    6. Kinh tế Chợ Trời: **Quy tắc Unbound 100% đồ Boss**, Mở sạp dã ngoại, Giao dịch P2P 2 bước.
    7. Chiến đấu PK Thế Giới: 3 Cờ (Trắng, Đỏ, Bang), Điểm tội ác, Tên Đỏ chết rơi vàng và 50% nguy cơ rớt đồ.
    8. Tổ đội 4 người (+10% EXP/người) và Sự kiện Công Thành Vực Đá Quý chiếm 5% thuế chợ trời.

### 📐 [03_CONG_THUC_VA_CAN_BANG_CHI_SO.md](file:///c:/Projects/Game%20Online/Documents/03_CONG_THUC_VA_CAN_BANG_CHI_SO.md)
* **Nội dung:** 
  * Toàn bộ công thức toán học chiến đấu: Công thức giảm trừ sát thương theo Giáp, Kháng phép, Né đòn, Bạo kích, Đồng điệu nguyên tố.
  * Bảng tỷ lệ quy đổi 4 Điểm Tiềm Năng (STR, INT, DEX, VIT).
  * Đường cong kinh nghiệm (EXP Curve) chuẩn mực từ Cấp 1 đến 60.
  * Bảng chỉ số toàn bộ Quái thường và Ma Thú Bạo Chúa (HP, ATK, DEF, Drop Rate).
  * Mô hình toán xác suất Cường hóa +1 đến +15, kỳ vọng vàng & đá cần tiêu hao (Gold Sink).
  * Bảng trọng số Affix RNG (Min - Max roll stats) và Hệ số cân bằng PvP.

### 🗓️ [04_KE_HOACH_PHAT_TRIEN_THEO_NGAY.md](file:///c:/Projects/Game%20Online/Documents/04_KE_HOACH_PHAT_TRIEN_THEO_NGAY.md)
* **Nội dung:** 
  * Lộ trình Sprint 35 Ngày (5 Tuần) tăng tốc từ con số 0 đến ngày Deploy chạy thử nghiệm:
    * **Tuần 1 (Ngày 1 - 6):** Móng Engine, Client/Server, Bản đồ Isometric & Di chuyển 8 hướng mượt mà.
    * **Tuần 2 (Ngày 7 - 12):** AI Quái vật, Tính sát thương, Damage Popup Text, VFX hạt ma pháp & Rơi đồ.
    * **Tuần 3 (Ngày 13 - 18):** Túi đồ 40 ô, Sách Phép, Lễ Thức Tỉnh Cấp 10, Điểm tiềm năng & Auto-Grind.
    * **Tuần 4 (Ngày 19 - 24):** 20 Channels, Boss dã ngoại, Bảng Top Damage, Rương 30s & Tranh cướp đồ.
    * **Tuần 5 (Ngày 25 - 29):** Lò rèn +15, GLSL Shader hào quang vũ khí, Mở sạp chợ trời & Trade P2P.
    * **Tuần 6 (Ngày 30 - 35):** Cờ đỏ PK, Công thành bang hội, Tối ưu hóa WebGL 12MB & Deploy Online.

### 🏗️ [05_KIEN_TRUC_HE_THONG_VA_CODE_STRUCTURE.md](file:///c:/Projects/Game%20Online/Documents/05_KIEN_TRUC_HE_THONG_VA_CODE_STRUCTURE.md)
* **Nội dung:** 
  * Mô hình kiến trúc 4 tầng chuẩn Enterprise: **`contracts` - `data` (Model) - `logic` (Controller) - `view` (View)**.
  * **Hệ thống Quản lý Popup Stack & ShowType:** Ngăn xếp LIFO với 3 cơ chế mở `ShowType.Nothing`, `ShowType.Dismiss`, `ShowType.DismissAll`.
  * **Hệ thống Tiến Trình Khởi Động (Boot Phase Pipeline):** 6 giai đoạn nạp game có trọng số % (`SystemConfig` -> `Auth` -> `MasterData` -> `AssetPreload` -> `NetworkConnect` -> `EnterWorld`).
  * **Hệ thống Đạn Đạo & Hiệu Ứng:** Tích hợp `MissileSystem` và `FxSystem` trực tiếp vào kiến trúc với Zero Garbage Collection (Object Pool).
  * **Hệ thống Đa Ngôn Ngữ (Localization - I18n):** Tra cứu từ điển `vi.json` / `en.json`, thay thế tham số động `{param}`, Hot-Switching tức thời.
  * Khung mã nguồn TypeScript hoàn chỉnh cho `PopupManager`, `PhaseManager`, `MissileSystem`, `FxSystem`, `LocalizationManager`.

### 💥 [06_HE_THONG_SKILL_FX_VA_MISSILE.md](file:///c:/Projects/Game%20Online/Documents/06_HE_THONG_SKILL_FX_VA_MISSILE.md)
* **Nội dung:** 
  * **Danh mục Skill dựng sẵn cho Player:** 6 Bộ Cổ Thư (Hỏa, Băng, Lôi, Độc, Quang, Ám) đầy đủ 4 tầng kỹ năng (Active Core, Nhánh A/B, Nội tại Passive, Tuyệt kỹ nộ khí).
  * **Danh mục Skill dựng sẵn cho Quái thường & 5 Đại Ma Thú Bạo Chúa (Field Boss):** Húc càn, bão bào tử mù mắt, dậm đất địa chấn, tam đầu nọc độc, hố đen hư không.
  * **Hệ thống Quản lý Đạn Đạo (`MissileSystem`):** 5 loại quỹ đạo (bay thẳng, đuổi mục tiêu, parabol, xuyên thấu, giật nảy), vòng lặp update 60 FPS, kiểm tra hitbox va chạm và Object Pool.
  * **Hệ thống Quản lý Hiệu Ứng Hình Ảnh (`FxSystem`):** Quản lý 4 nhóm FX (Ground Decal, Impact Hit, Attached Follow, Camera Screen Shake) bằng GPU particle và Sprite animation.

### 🎭 [07_KICH_BAN_HOI_THOAI_COT_TRUYEN.md](file:///c:/Projects/Game%20Online/Documents/07_KICH_BAN_HOI_THOAI_COT_TRUYEN.md)
* **Nội dung:** 
  * Kịch bản lời dẫn mở màn sử thi (Prologue Cinematic).
  * Lời thoại chi tiết theo từng nhiệm vụ chính tuyến của 4 Chương:
    * Gặp Trưởng Lão Vane & Lễ Thức Tỉnh Cấp 10 tại Bệ Đá Thần Vực.
    * Gặp Thợ Rèn Vulcan (lời cảnh báo đập đồ xịt vỡ nát trang bị).
    * Gặp Dược Sĩ Miria (đổi mảnh tàn trang lấy hòm sách).
    * Gặp Đạo Sĩ Tôn Lão Nhược (nghi thức tẩy mệnh đổi hệ).
    * Lính gác cổng thành cảnh báo ra khu vực đồ sát bật cờ đỏ.
    * Bá Tước Silas công bố giờ Công Thành Vực Đá Quý (20:00 Thứ Bảy).
    * Đối đầu tối hậu với Bóng Ma Hư Không (Void Herald).
  * Bộ thông điệp loa chạy chữ toàn server (Boss xuất hiện, rương mở khóa cướp đồ, đập đồ +15 thành công, tiêu diệt tên đỏ).

---
*Tài liệu được khởi tạo và lưu trữ trực tiếp trong thư mục `Documents` của dự án.*
