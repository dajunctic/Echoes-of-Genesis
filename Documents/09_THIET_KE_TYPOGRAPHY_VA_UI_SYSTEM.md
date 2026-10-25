# TÀI LIỆU THIẾT KẾ TYPOGRAPHY & HỆ THỐNG GIAO DIỆN (UI SYSTEM)
**Dự án:** Echoes of Genesis (Astraea Online) — 2.5D Isometric Dark Fantasy ARPG  
**Phiên bản:** 2.0 - Bổ sung Hệ Thống UI Tu Luyện Đan Điền Biến Thể Theo 4 Trận Doanh  
**Tác giả:** Đội ngũ phát triển Echoes of Genesis  

---

## MỤC LỤC
1. [PHẦN 1: HỆ THỐNG TYPOGRAPHY CHUẨN DARK FANTASY (FULL VIETNAMESE)](#phần-1-hệ-thống-typography-chuẩn-dark-fantasy-full-vietnamese)
2. [PHẦN 2: PHÂN TÍCH CÁC BỘ UI PACK DARK FANTASY PHÙ HỢP TRÊN THỊ TRƯỜNG](#phần-2-phân-tích-các-bộ-ui-pack-dark-fantasy-phù-hợp-trên-thị-trường)
3. [PHẦN 3: ĐỀ XUẤT LỘ TRÌNH TRIỂN KHAI GIAO DIỆN](#phần-3-đề-xuất-lộ-trình-triển-khai-giao-diện)
4. [PHẦN 4: HỆ THỐNG UI TU LUYỆN BIẾN THỂ THEO 4 ĐẠI TRẬN DOANH (DYNAMIC CULTIVATION UI)](#phần-4-hệ-thống-ui-tu-luyện-biến-thể-theo-4-đại-trận-doanh-dynamic-cultivation-ui)

---

## PHẦN 1: HỆ THỐNG TYPOGRAPHY CHUẨN DARK FANTASY (FULL VIETNAMESE)

Nhằm mang lại trải nghiệm đậm chất Dark Fantasy quý phái, kết hợp phong cách Gacha/RPG sử thi hiện đại (như Genshin Impact, Fate/Grand Order, Reverse: 1999), toàn bộ hệ thống chữ của game sử dụng font **`Spectral`** (thiết kế bởi Production Type cho Google Fonts) kết hợp font số chiến đấu **`Chakra Petch`**, hỗ trợ 100% tiếng Việt có dấu cực kỳ chuẩn xác và thanh nhã.

### 1. Phân cấp Font chữ chủ lực (The Font System)

| Font chữ | Nhóm phân loại | Vai trò trong Game | Đặc điểm thẩm mỹ |
| :--- | :--- | :--- | :--- |
| **`Spectral`** | Noble Fantasy Serif | **Toàn bộ UI, Tên nhân vật, Tên quái vật, Tên bản đồ, Thanh Loading, Lời thoại NPC, Thẻ Gacha** | Phong cách Serif quý tộc, thanh thoát, đĩnh đạc; cực kỳ hợp với hệ thống Gacha thẻ bài, cổ thư và đối thoại sử thi; hỗ trợ trọn vẹn bộ dấu tiếng Việt không bị lỗi font hay phèn. |
| **`Cinzel`** | Classical Roman Display | **Tiêu đề lớn đặc biệt, Logo phụ** | Mang hơi hướng khắc đá La Mã cổ đại uy nghiêm. |
| **`Chakra Petch`** | Sharp Angular Display | **Số sát thương nhảy (Damage Popups), Chỉ số HP/MP, Phím tắt Action Dock, Ping/FPS** | Nét vát 45 độ sắc bén, lạnh lùng, tốc độ đọc tức thì trong các pha combat dồn dập, bạo kích. |

---

### 2. Thông số thiết kế & Render In-Game

1. **Bảng tên nhân vật (Player Nameplate):**
   - Font: `'Spectral', Georgia, serif`
   - Cỡ chữ: `13.5px bold`
   - Màu sắc: `#fbbf24` (Vàng hoàng kim với viền đen `stroke: #000000`, độ dày viền `3.5px`).
   - Tọa độ: `(0, -78px)` tính từ chân nhân vật, tạo khoảng đệm thoáng đãng trên đỉnh đầu.
2. **Bảng tên quái vật dã ngoại (Monster Nameplate):**
   - Font: `'Spectral', Georgia, serif`
   - Cỡ chữ: `12.5px bold`
   - Màu sắc: `#f87171` (Đỏ thẫm viền đen `3.5px`).
3. **Số sát thương chiến đấu (Floating Combat Text):**
   - Font: `'Chakra Petch', sans-serif`
   - Cỡ chữ: `15px bold`
   - Hiệu ứng: Bay lên `y - 35px`, mờ dần theo hàm mũ `Power2` trong 800ms.
4. **Khung mục tiêu quái vật (Target Frame - Top Center):**
   - Tên quái: `'Spectral', Georgia, serif`, cỡ `16px bold`, dãn chữ `0.5px`, màu đỏ hồng `#fca5a5`.
5. **Thanh kỹ năng (Action Dock - Bottom Center):**
   - Phím tắt (1..6, Q, W, E): `'Chakra Petch', sans-serif`, cỡ `11px bold`, màu vàng `#fbbf24`.

---

## PHẦN 2: PHÂN TÍCH CÁC BỘ UI PACK DARK FANTASY PHÙ HỢP TRÊN THỊ TRƯỜNG

### Pack 1: Flare Game Native Interface Pack (Clint Bellanger) ⭐ [KHUYÊN DÙNG SỐ 1]
* **Nguồn gốc:** Đã tải sẵn trực tiếp trong mã nguồn dự án: `client/public/assets/flare/fantasycore/images/menus/`.
* **Giấy phép:** CC-BY-SA 3.0 / GPL (Miễn phí thương mại).
* **Nội dung bộ asset:**
  - `actionbar_trim.png`: Khung viền kim loại chạm trổ Gothic cho dock chiêu thức.
  - `inventory.png` & `character.png`: Khung cửa sổ hòm đồ dạng lưới ô vuông (grid) và bảng trang bị búp bê giấy (paperdoll) chuẩn Diablo.
  - `bar_hp.png`, `bar_mp.png`, `bar_enemy_hp.png`: Thanh ngọc huyết đỏ và lam bảo ngọc nguyên khối.
  - `minimap.png`: La bàn cổ bằng đồng cổ điển.
  - `dialog_box.png`: Cuộn giấy da cổ đại cho hội thoại NPC và tàn trang Cổ Thư.
* **Ưu điểm:** Tương thích 100% về tỉ lệ góc nhìn 2.5D Isometric, cùng phong cách đồ họa với toàn bộ quái vật và hero của Flare.

---

### Pack 2: RPG UI Set 1 — Diablo Style (Foozle)
* Quả cầu máu (Health Orb) và mana (Mana Orb) bằng thủy tinh ma thuật ở hai góc dưới màn hình. Viền nút mạ đồng gỉ sét.

### Pack 3: Dark Fantasy RPG UI Kit Full Pack (ZSS Game Lab)
* Hơn 900+ sprite PNG vẽ tay sắc nét, phong cách Grimdark Gothic / Dark Souls. Cần tối ưu thành Texture Atlas WebP.

### Pack 4: Ancient Realms — Dark Fantasy UI Pack (DesertCodex)
* Cổ vật thần thoại chạm khắc phù hiệu Rune trên đá hoa cương đen, cực kỳ hợp với hệ thống Cổ Thư Grimoire.

### Pack 5: Kenney Fantasy & Game Icons UI Pack
* Biểu tượng trạng thái (Buff/Debuff), slot hành trang cực nhẹ, bản quyền tự do CC0.

---

## PHẦN 3: ĐỀ XUẤT LỘ TRÌNH TRIỂN KHAI GIAO DIỆN

1. **Giai đoạn 1 (Đã hoàn tất):** 
   - Đưa bộ 3 font `Spectral` + `Cinzel` + `Chakra Petch` vào vận hành trực tiếp trên web client.
   - Nâng cao tọa độ tên nhân vật lên `-78px` để tạo sự cân đối thị giác.
2. **Giai đoạn 2 (Tiếp theo):**
   - Thay thế viền CSS thuần của Thanh Action Dock bằng texture `actionbar_trim.png` từ Flare Game.
   - Xây dựng cửa sổ Túi Đồ (Inventory 40 ô) và Bảng Nhân Vật dựa trên `inventory.png` và `character.png`.
   - Tích hợp cửa sổ **Đài Triệu Hoán Gacha Thái Hư** và **Bảng Tu Luyện Cảnh Giới Đan Điền**.

---

## PHẦN 4: HỆ THỐNG UI TU LUYỆN BIẾN THỂ THEO 4 ĐẠI TRẬN DOANH (DYNAMIC CULTIVATION UI)

Dù bản chất người chơi mang **Thể Chất Hỗn Nguyên (Genesis Body)** – có thể dung nạp mọi loại công pháp – nhưng **khi người chơi đã chọn đầu quân cho Phe nào (tại Cấp 15 Trúc Cơ), toàn bộ Giao diện (UI), Hiệu ứng (VFX), Bảng Cảnh Giới và Hoạt Ảnh Đột Phá BẮT BUỘC phải biến đổi (Dynamic Theming / Skinning) theo đúng phong cách bản sắc của Phe đó!**

```
                          ┌────────────────────────┐
                          │   HỖN NGUYÊN TÂM BẢO   │
                          │ (Genesis Core ở Trung) │
                          └───────────┬────────────┘
                                      │
        ┌──────────────┬──────────────┴──────────────┬──────────────┐
        ▼              ▼                             ▼              ▼
【 KIẾM TÔNG 】  【 MA ĐIỆN 】               【 GIÁO ĐÌNH 】  【 MA VIỆN 】
 (Thái Cực Bát Quái) (Huyết Hải Tà Trận)         (Thánh Quang Kính)  (Rune Tinh Tú)
```

---

### 1. BẢNG QUY CHUẨN THIẾT KẾ VISUAL 4 PHE PHÁI

| Trận Doanh | Tông Màu Chủ Đạo | Khung Đan Điền Trung Tâm | Thanh Tu Vi (EXP Bar) | Hoạt Ảnh Đột Phá (Breakthrough VFX) | Chuỗi Cảnh Giới Hiển Thị |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Kiếm Tông Tiên Môn** *(Đông Phương Chính Đạo)* | **Xanh Ngọc Bích (`#06b6d4`), Trắng Mây (`#f8fafc`), Vàng Nhạt** | Đồ hình **Thái Cực Âm Dương** xoay chầm chậm, phi kiếm lơ lửng bay quanh quỹ đạo Bát Quái. | Thiết kế dạng **Bản Trúc Thư (Cuộn ngọc giản)** tự mở dần ra khi tích tu vi. | Tiếng kiếm ngân *Keng... Keng!*, vạn đạo kiếm khí xé toạc mây mù bay vút lên trời. | Luyện Khí ➔ Trúc Cơ Kiếm Thai ➔ Kim Đan Kiếm Tâm ➔ Kiếm Hồn Nguyên Anh ➔ Kiếm Thần Hóa Thần ➔ Độ Kiếp Phi Thăng |
| **2. Vạn Huyết Ma Điện** *(Đông Phương Ma Đạo)* | **Đỏ Thẫm Huyết Tộc (`#dc2626`), Đen Hư Không (`#09090b`), Tím U Linh** | **Trái Tim Ma Thần** màu đỏ đen đập từng nhịp chân thực (*thình thịch*), xúc tua bóng tối và ma hỏa vây quanh. | Thiết kế dạng **Bình Pha Lê Chứa Huyết Dịch** dâng đầy dần lên. | Màn hình đỏ ngầu, bóng ma đầu lâu 3 đầu gầm thét, năng lượng huyết sắc bộc phát. | Luyện Khí ➔ Huyết Tủy Trúc Cơ ➔ Diệt Thế Huyết Đan ➔ Ma Anh Xuất Huyết ➔ Chân Ma Hóa Thần ➔ Cửu U Thiên Kiếp |
| **3. Thánh Quang Giáo Đình** *(Tây Phương Thánh Điện)* | **Vàng Hoàng Gia (`#eab308`), Trắng Thánh (`#ffffff`), Xanh Sapphire** | **Vương Miện Ánh Sáng & Thánh Giá Khởi Nguyên**, các đốm sáng thiên sứ bay lượn xung quanh. | Dải hoa văn **Kinh Thánh Mạ Vàng**, chữ thánh kinh cổ phát sáng dần lên. | Chuông nhà thờ ngân vang, cột sáng thánh quang rọi xuống, xòe đôi **Cánh Ánh Sáng** sau lưng. | Tập Sự Kỵ Sĩ ➔ Thánh Kỵ Sĩ Trúc Cơ ➔ Quang Huy Kim Đan ➔ Thánh Linh Nguyên Anh ➔ Thiên Sứ Hóa Thần ➔ Thánh Thần Phán Quyết |
| **4. Hư Không Ma Viện** *(Tây Phương Ma Pháp)* | **Tím Tinh Vân (`#a855f7`), Xanh Neon Dạ Quang (`#10b981`), Băng Lam** | **Ma Trận Vòng Tròn 7 Lớp** xoay ngược chiều nhau, ở tâm là Hố Đen Vũ Trụ hút tinh vân. | Thiết kế dạng **Ống Nghiệm Tinh Thể** chứa dung dịch mana lấp lánh bụi sao. | Không gian vỡ vụn như gương vỡ, ma trận bùng nổ gấp 3 lần, mắt rồng chớp sáng giữa vũ trụ. | Ma Pháp Đồ Đệ ➔ Ma Đạo Trúc Cơ ➔ Tinh Hạch Ma Đan ➔ Hư Không Nguyên Thần ➔ Thái Cổ Hiền Triết ➔ Hỗn Mang Chúa Tể |

---

### 2. YẾU TỐ "HỖN NGUYÊN" BẤT BIẾN TRÊN MỌI GIAO DIỆN

Dù UI khoác lên tấm áo của bất kỳ Phe phái nào, bản chất "Hỗn Nguyên" của người chơi vẫn luôn được tôn vinh qua 2 cơ chế:
1. **Lõi Khởi Nguyên Tâm (Genesis Core):**  
   Tại chính tâm đan điền, luôn có một viên ngọc nhỏ phát sáng luân chuyển ngũ sắc xoay vần. Đó là bằng chứng cốt lõi chứng minh người chơi mang huyết mạch Hỗn Nguyên có thể câu thông với cả 4 đại trường phái.
2. **Cơ Chế Dynamic Theme Hot-Switching (Đổi Phe Tức Thời):**  
   Khi người chơi đến gặp NPC Tôn Lão Nhược tiêu tốn Vàng / Bình Tẩy Hồn để chuyển đổi giữa 4 Phe:
   * Toàn bộ hệ thống UI Tu Luyện, Bảng Kỹ Năng, Màu sắc Thanh EXP, Âm thanh SFX và Hoạt ảnh Đột Phá sẽ **tự động chuyển đổi Skin tức thì (Hot-Switch)**.
   * Toàn bộ tiến độ tu vi, cấp bậc cảnh giới được bảo lưu 100%, không bị tụt lùi hay bắt cày lại từ đầu.

---
*Tài liệu UI System được cập nhật chính thức vào Master Docs của dự án Echoes of Genesis.*
