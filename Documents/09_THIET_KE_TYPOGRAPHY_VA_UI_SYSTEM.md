# TÀI LIỆU THIẾT KẾ TYPOGRAPHY & HỆ THỐNG GIAO DIỆN (UI SYSTEM)
**Dự án:** Echoes of Genesis (Astraea Online) — 2.5D Isometric Dark Fantasy ARPG  
**Phiên bản:** 1.0  
**Tác giả:** Đội ngũ phát triển Echoes of Genesis  

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

## PHẦN 2: PHÂN TÍCH CÁC BỘ UI PACK DARK FANTASY PHÙ HỢP NHẤT TRÊN THỊ TRƯỜNG

Để tạo nên giao diện Dark Fantasy ARPG đỉnh cao (như Diablo 2 Resurrected / Grim Dawn / Flare), dưới đây là phân tích 5 bộ UI Pack hàng đầu từ cộng đồng OpenGameArt, Itch.io và chính Flare Game.

---

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
* **Nhược điểm:** Cần viết code HTML/CSS hoặc Phaser Container để ghép các lát cắt (slice).

---

### Pack 2: RPG UI Set 1 — Diablo Style (Tác giả: Foozle)
* **Nguồn:** Itch.io & OpenGameArt (Dựa trên tài nguyên CC0 OpenGameArt).
* **Phong cách:** Diablo I & II cổ điển.
* **Nội dung:**
  - Cặp quả cầu máu (Health Orb) và mana (Mana Orb) bằng thủy tinh ma thuật ở hai góc dưới màn hình.
  - Nút bấm viền đá mạ đồng gỉ sét, rãnh khảm ngọc nguyên tố.
  - Cửa sổ nhiệm vụ có viền đầu lâu và cánh dơi.
* **Đánh giá:** Rất quen thuộc với người chơi yêu thích Diablo cổ điển. Phù hợp nếu muốn làm cụm cầu HP/MP hai bên đáy màn hình.

---

### Pack 3: Dark Fantasy RPG UI Kit Full Pack (Tác giả: ZSS Game Lab)
* **Nguồn:** Itch.io.
* **Phong cách:** Grimdark Gothic / Dark Souls.
* **Nội dung:** Hơn 900+ sprite PNG trong suốt, độ phân giải cao, gồm HUD chiến đấu, cây kỹ năng (Skill Tree), bảng thuộc tính chi tiết, pop-up thăng cấp.
* **Ưu điểm:** Số lượng tài nguyên khổng lồ, đồ họa vẽ tay kỹ lưỡng.
* **Nhược điểm:** Dung lượng tương đối nặng (~150MB), cần chọn lọc và nén Texture Atlas WebP để tối ưu tải nhanh trên Web H5 Mobile.

---

### Pack 4: Ancient Realms — Dark Fantasy UI Pack (Tác giả: DesertCodex)
* **Nguồn:** Itch.io.
* **Phong cách:** Cổ vật thần thoại, chạm khắc phù hiệu Rune trên đá hoa cương đen.
* **Đánh giá:** Rất hợp với các tính năng Cổ Thư Khởi Nguyên (Grimoire), bảng khảm Ngọc Ấn Ký và Luyện Hóa Trang Bị.

---

### Pack 5: Kenney Fantasy & Game Icons UI Pack
* **Nguồn:** Kenney.nl (Public Domain CC0).
* **Nội dung:** Hàng trăm icon kỹ năng, tiền vàng, ngọc thạch, viền nút vuông tối giản.
* **Ưu điểm:** Bản quyền tự do tuyệt đối, cực kỳ nhẹ.
* **Ứng dụng:** Rất tốt để làm các icon trạng thái (Buff/Debuff), slot hành trang và icon mini trên bản đồ.

---

## PHẦN 3: ĐỀ XUẤT LỘ TRÌNH TRIỂN KHAI GIAO DIỆN CHO ECHOES OF GENESIS

1. **Giai đoạn 1 (Đã hoàn tất):** 
   - Đưa bộ 3 font `Grenze Gotisch` + `Grenze` + `Chakra Petch` vào vận hành trực tiếp trên web client.
   - Nâng cao tọa độ tên nhân vật lên `-78px` để tạo sự cân đối thị giác.
2. **Giai đoạn 2 (Tiếp theo):**
   - Thay thế viền CSS thuần của Thanh Action Dock bằng texture `actionbar_trim.png` từ Flare Game.
   - Ứng dụng khung đá cổ `bar_enemy_hp.png` cho mục tiêu quái vật.
   - Xây dựng cửa sổ Túi Đồ (Inventory 40 ô) và Bảng Nhân Vật dựa trên `inventory.png` và `character.png` của Flare.
