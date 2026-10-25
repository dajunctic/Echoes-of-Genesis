# TÀI LIỆU CÔNG THỨC TOÁN HỌC & CÂN BẰNG CHỈ SỐ (GAME MATH & BALANCE)
**Dự án:** Echoes of Genesis (Astraea Online - Cổ Thư Hỗn Mang)  
**Tài liệu:** Combat Formulas, Stat Scaling, EXP Curves (Lv 1 - 150), Tribulation Math & Drop Tables  
**Phiên bản:** 2.0 - Chuẩn Hóa 9 Đại Cảnh Giới & Hệ Thống Lôi Kiếp  

---

## MỤC LỤC
1. [HỆ THỐNG THUỘC TÍNH CƠ BẢN & CÔNG THỨC QUY ĐỔI](#1-hệ-thống-thuộc-tính-cơ-bản--công-thức-quy-đổi)
2. [CÔNG THỨC TÍNH SÁT THƯƠNG & KHẮC CHẾ (COMBAT FORMULAS)](#2-công-thức-tính-sát-thương--khắc-chế-combat-formulas)
3. [ĐƯỜNG CONG KINH NGHIỆM EXP & 9 ĐẠI CẢNH GIỚI (CẤP 1 - 150)](#3-đường-cong-kinh-nghiệm-exp--9-đại-cảnh-giới-cấp-1---150)
4. [BẢNG CHỈ SỐ QUÁI VẬT & MA THÚ BẠO CHÚA (MONSTER STATS TABLE)](#4-bảng-chỉ-số-quái-vật--ma-thú-bạo-chúa-monster-stats-table)
5. [MÔ HÌNH TOÁN XÁC SUẤT CƯỜNG HÓA VŨ KHÍ (+1 ĐẾN +15)](#5-mô-hình-toán-xác-suất-cường-hóa-vũ-khí-1-đến-15)
6. [HỆ THỐNG TRỌNG SỐ DÒNG NGẪU NHIÊN (AFFIX RNG WEIGHTS)](#6-hệ-thống-trọng-số-dòng-ngẫu-nhiên-affix-rng-weights)
7. [CÂN BẰNG PVP & TỶ LỆ TRỪNG PHẠT TÊN ĐỎ](#7-cân-bằng-pvp--tỷ-lệ-trừng-phạt-tên-đỏ)
8. [CÔNG THỨC TOÁN LÔI KIẾP & RỦI RO THẤT BẠI KHI ĐỘ KIẾP](#8-công-thức-toán-lôi-kiếp--rủi-ro-thất-bại-khi-độ-kiếp)

---

## 1. HỆ THỐNG THUỘC TÍNH CƠ BẢN & CÔNG THỨC QUY ĐỔI

Mỗi nhân vật khởi tạo tại Cấp 1 có bộ chỉ số nền cơ sở (Base Stats):
- `Base_HP = 200`, `Base_MP = 100`
- `Base_Phys_ATK = 15`, `Base_Magic_ATK = 15`
- `Base_Armor = 10`, `Base_Magic_Resist = 10`
- `Base_Crit_Rate = 5%`, `Base_Crit_Damage = 150%`
- `Base_Move_Speed = 200` (pixels/giây trên màn hình canvas)

### 1.1. Công Thức Thăng Cấp & Điểm Tiềm Năng
- Mỗi khi tăng 1 Cấp độ (Level Up):
  - Nhận tự động: `+30 HP Tối Đa`, `+10 MP Tối Đa`, `+1 Giáp`, `+1 Kháng Phép`.
  - Nhận **5 Điểm Tiềm Năng (TN)** để người chơi tự do phân bổ vào STR, INT, DEX, VIT.

### 1.2. Bảng Quy Đổi Điểm Tiềm Năng Chi Tiết

$$\begin{aligned}
\text{Total\_Phys\_ATK} &= \text{Base\_Phys\_ATK} + (\text{STR} \times 3.0) + \text{Gear\_Phys\_ATK} \\
\text{Total\_Magic\_ATK} &= \text{Base\_Magic\_ATK} + (\text{INT} \times 3.5) + \text{Gear\_Magic\_ATK} \\
\text{Total\_HP} &= \text{Base\_HP} + (\text{Level} \times 30) + (\text{VIT} \times 25.0) + \text{Gear\_HP} \\
\text{Total\_MP} &= \text{Base\_MP} + (\text{Level} \times 10) + (\text{INT} \times 15.0) + \text{Gear\_MP} \\
\text{Total\_Armor} &= \text{Base\_Armor} + (\text{Level} \times 1) + (\text{VIT} \times 1.5) + \text{Gear\_Armor} \\
\text{Total\_Crit\_Chance} &= \text{Base\_Crit} + (\text{DEX} \times 0.15\%) + \text{Gear\_Crit} \quad (\text{Max Cap: } 75\%) \\
\text{Total\_Crit\_Dmg} &= 150\% + (\text{STR} \times 0.20\%) + \text{Gear\_Crit\_Dmg} \\
\text{Total\_Evasion} &= (\text{DEX} \times 0.20\%) + \text{Gear\_Evasion} \quad (\text{Max Cap: } 40\%) \\
\text{Total\_Attack\_Speed} &= 1.0 + (\text{DEX} \times 0.001) \quad (\text{Hệ số nhân tốc độ ra đòn})
\end{aligned}$$

---

## 2. CÔNG THỨC TÍNH SÁT THƯƠNG & KHẮC CHẾ (COMBAT FORMULAS)

### 2.1. Công Thức Giảm Trừ Sát Thương Theo Giáp (Damage Mitigation)
Tỷ lệ giảm trừ sát thương vật lý nhận vào ($DR_{phys}$) và ma pháp ($DR_{magic}$):

$$DR_{phys} = \frac{\text{Armor}}{\text{Armor} + 400 + (8 \times \text{Attacker\_Level})}$$

### 2.2. Kiểm Tra Né Đòn (Accuracy vs Evasion)
$$\text{Hit\_Rate} = \min\Big(0.95, \, \max\big(0.05, \, 1.0 - (\text{Defender\_Evasion} - \text{Attacker\_Accuracy})\big)\Big)$$

### 2.3. Công Thức Sát Thương Cuối Cùng (Final Output Damage)
$$\text{Raw\_Damage} = (\text{Base\_Skill\_Damage} + \text{Stat\_Scaling}) \times \text{Resonance\_Multiplier}$$

Trong đó $\text{Resonance\_Multiplier} = 1.3$ nếu Sách Phép trùng Ấn Ký Nguyên Tố / Linh Căn.  
Nếu kích hoạt Bạo Kích:
$$\text{Crit\_Damage} = \text{Raw\_Damage} \times \frac{\text{Total\_Crit\_Dmg}}{100}$$
Sát thương thực tế mục tiêu gánh chịu:
$$\text{Final\_Damage} = \text{Crit\_Damage} \times (1 - DR) \times \text{PvP\_Modifier}$$
*(Trong đó $\text{PvP\_Modifier} = 0.60$ khi đánh nhau giữa người chơi).*

---

## 3. ĐƯỜNG CONG KINH NGHIỆM EXP & 9 ĐẠI CẢNH GIỚI (CẤP 1 - 150)

Để đảm bảo game có chiều sâu và người chơi gắn bó hàng năm trời, đường cong EXP được thiết kế theo hàm lũy thừa dốc:

$$\text{EXP\_Required}(L) = \left\lfloor 120 \times L^{2.35} + 80 \times L \right\rfloor$$

### 3.1. Bảng 9 Đại Cảnh Giới & Thời Gian Cày Cuốc Chuẩn Mực

| Cảnh Giới | Thang Cấp (Level) | Tiểu Cảnh Giới | Tổng EXP Tích Lũy | Thời Gian Cày Ước Tính | Khu Vực Bản Đồ Tương Ứng |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **1. Luyện Khí Kỳ** | **Lv 1 - 20** | 10 Tầng Kinh Mạch | 450,000 | 1 - 3 Ngày | Làng Khởi Nguyên & Rừng Sơ Khai |
| **2. Trúc Cơ Kỳ** | **Lv 21 - 40** | Sơ / Trung / Hậu / Viên Mãn | 4,200,000 | 1 - 2 Tuần | Thung Lũng Cỏ Gió & Đài Thái Hư (Chọn Phe) |
| **3. Kim Đan Kỳ** | **Lv 41 - 60** | Sơ / Trung / Hậu / Viên Mãn | 18,500,000 | 3 - 4 Tuần | Đầm Lầy Tử Khí (Tam Trọng Lôi Kiếp) |
| **4. Nguyên Anh Kỳ** | **Lv 61 - 80** | Sơ / Trung / Hậu / Viên Mãn | 58,000,000 | 1.5 - 2 Tháng | Miệng Núi Lửa Tro Tàn (Lục Trọng Lôi Kiếp) |
| **5. Hóa Thần Kỳ** | **Lv 81 - 100** | Sơ / Trung / Hậu / Viên Mãn | 145,000,000 | 2.5 - 3 Tháng | Hẻm Núi Gió Hú (Cửu Trọng Lôi Kiếp) |
| **6. Luyện Hư Kỳ** | **Lv 101 - 115** | Sơ / Trung / Hậu / Viên Mãn | 280,000,000 | 4 - 5 Tháng | Vực Đá Quý (Tâm Ma Huyễn Cảnh) |
| **7. Hợp Thể Kỳ** | **Lv 116 - 130** | Sơ / Trung / Hậu / Viên Mãn | 520,000,000 | 6 - 8 Tháng | Vết Nứt Hư Không (Bát Cực Lôi Kiếp) |
| **8. Đại Thừa Kỳ** | **Lv 131 - 145** | Sơ / Trung / Hậu / Viên Mãn | 890,000,000 | 9 - 12 Tháng | Phế Tích Cổ Thụ Thần Vực |
| **9. Độ Kiếp Phi Thăng**| **Lv 146 - 150**| Cực Hạn Phong Thần | **1,500,000,000** | **1 Năm+ (Endgame)**| Tế Đàn Khởi Nguyên (Cửu Cửu 81 Đạo Lôi) |

### 3.2. Bốn Nấc Thang Tiểu Cảnh Giới
Mỗi Đại Cảnh Giới chia làm 4 giai đoạn nạp EXP:
* **Sơ Kỳ (0% - 25%):** Mở khóa chỉ số nền tảng của cảnh giới.
* **Trung Kỳ (26% - 50%):** Tăng 10% uy lực toàn bộ kỹ năng.
* **Hậu Kỳ (51% - 75%):** Tăng 15% tốc độ hồi phục Mana / Nội lực.
* **Đại Viên Mãn (76% - 100%):** Đạt ngưỡng **Nghẽn Cảnh Giới (Bottleneck)**. EXP bị khóa 100% cho đến khi thực hiện nghi thức Độ Kiếp!

---

## 4. BẢNG CHỈ SỐ QUÁI VẬT & MA THÚ BẠO CHÚA (MONSTER STATS TABLE)

| Tên Quái Vật | Cấp Độ | Máu (HP) | Sát Thương (ATK) | Giáp (Armor) | EXP Rơi | Vàng (Gold) | Drop Đan Dược & Sách |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Ốc Sên Vỏ Gai** | 1 | 80 | 8 - 12 | 2 | 25 | 2 - 5 | Mảnh Tàn Trang Luyện Khí |
| **Nấm Độc Biến Dị** | 10 | 650 | 45 - 60 | 20 | 210 | 25 - 40 | Bột Tẩy Tủy Sơ Cấp |
| **Spore King (Boss)** | **20** | **35,000** | **180 - 240** | **95** | **15,000** | **2,000** | **Trúc Cơ Đan (100% rơi)** |
| **Sói Bão Cỏ Gió** | 35 | 4,200 | 190 - 250 | 85 | 1,400 | 150 | Dược Thảo Ngưng Đan |
| **Xà Thần Hydra (Boss)** | **60** | **280,000** | **850 - 1,100** | **320** | **120,000** | **18,000** | **Ngưng Đan Lộ + Sách Tím Epic** |
| **Hỏa Viêm Golem (Boss)**| **80** | **750,000** | **1,800 - 2,400**| **580** | **380,000** | **45,000** | **Hóa Anh Đan + Sách Vàng Mythic** |
| **Void Herald (World Boss)**| **100**| **2,500,000**| **4,200 - 5,500**| **1,100**| **1,200,000**| **150,000** | **Thần Hồn Thảo + Thần Khí +15** |
| **Thái Cổ Tà Thần (Raid)** | **150**| **15,000,000**| **12,000 - 18,000**| **3,500**| **8,000,000**| **1,000,000**| **Phi Thăng Thần Dược + Rương UR** |

---

## 5. MÔ HÌNH TOÁN XÁC SUẤT CƯỜNG HÓA VŨ KHÍ (+1 ĐẾN +15)

*Giữ nguyên cơ chế cân bằng Gold Sink: +1 đến +3 (100%), +4 đến +6 (tụt 1 cấp), +7 đến +9 (rớt về +4), +10 đến +12 (rớt về +4, cần bùa cao cấp), +13 đến +14 (nguy cơ vỡ 10%), +15 (1.5%, thất bại vỡ nát 100%).*

---

## 6. HỆ THỐNG TRỌNG SỐ DÒNG NGẪU NHIÊN (AFFIX RNG WEIGHTS)

*10 dòng Affix rơi từ Boss dã ngoại theo trọng số chuẩn mực: Giảm hồi chiêu (15%), Diện rộng (12%), Tốc độ đạn (14%), Hút mana (8%), Tỷ lệ bạo kích (10%), Sát thương chí mạng (9%), Tốc đánh (11%), Xuyên giáp (7%), Thưởng đồng hệ (6%), Toàn chỉ số (3%).*

---

## 7. CÂN BẰNG PVP & TỶ LỆ TRỪNG PHẠT TÊN ĐỎ

*Global PvP Multiplier: Sát thương người vs người nhân hệ số $0.60$. Tên Đỏ chết rơi 10% - 25% Vàng và có 25% - 50% nguy cơ rơi trang bị trên người ra ngoài.*

---

## 8. CÔNG THỨC TOÁN LÔI KIẾP & RỦI RO THẤT BẠI KHI ĐỘ KIẾP

### 8.1. Sát Thương Từng Đạo Sét Lôi Kiếp
Mỗi đạo sét giáng xuống người chơi tính theo phần trăm Máu Tối Đa kết hợp sát thương chuẩn:

$$\text{Damage}_{\text{Bolt}} = (\text{Max\_HP} \times P_{\text{lightning}}) \times (1 - \text{Mitigation}_{\text{Tribulation}})$$

| Cảnh Giới Đột Phá | Số Lượng Đạo Sét | Sát Thương Mỗi Đạo ($P_{\text{lightning}}$) | Khoảng Cách Giữa Các Đạo | Đan Dược Yêu Cầu |
| :--- | :---: | :---: | :---: | :--- |
| **Kim Đan (Lv 40 ➔ 41)** | **3 Đạo Sét** | 30% Max HP / đạo | 3.0 giây | Ngưng Đan Lộ |
| **Nguyên Anh (Lv 60 ➔ 61)** | **6 Đạo Sét** | 35% Max HP / đạo | 2.5 giây | Hóa Anh Đan |
| **Hóa Thần (Lv 80 ➔ 81)** | **9 Đạo Sét** | 40% Max HP / đạo | 2.0 giây | Thần Hồn Thảo |
| **Hợp Thể (Lv 115 ➔ 116)** | **Bát Cực Lôi Ma (8 Đạo)** | 45% Max HP / đạo | 1.8 giây | Thái Ất Chân Thủy |
| **Độ Kiếp Phi Thăng (Lv 145 ➔ 146)**| **Cửu Cửu Thiên Kiếp (81 Đạo)**| 50% Max HP / đạo | 0.8 giây liên hoàn | Cửu Chuyển Kim Đan |

### 8.2. Biện Pháp Giảm Trừ Sát Thương Lôi Kiếp ($\text{Mitigation}_{\text{Tribulation}}$)
* **Cắn Đan Dược Hộ Kiếp:** Giảm 25% sát thương sấm sét trong 30 giây.
* **Trang bị Pháp Bảo / Bùa Chống Sét:** Hấp thụ 20,000 - 100,000 sát thương lôi đình.
* **Đồng Đội Bang Hội "Hộ Pháp":** Mỗi đồng đội trong cùng bang đứng trong vòng trận pháp Bát Quái chia sẻ giúp **5% sát thương** (Tối đa 4 người chia sẻ giúp 20% sát thương).

### 8.3. Hậu Quả Khi Đột Phá Thất Bại (Chết Trong Lôi Kiếp)
* Nếu thanh Máu (HP) của người chơi tụt về 0 trong quá trình chịu lôi kiếp:
  * ❌ **Đột phá thất bại!** Nhân vật ngã gục, bốc khói đen.
  * ⚠️ **Trừng phạt:** **Tụt 20% lượng EXP của mốc Đại Viên Mãn hiện tại**, rơi vào trạng thái *"Trọng Thương Khí Huyết"* (giảm 15% chỉ số công thủ trong 10 phút).
  * Người chơi phải cày lại 20% EXP và gom lại Đan Dược để chuẩn bị cho lần thử độ kiếp kế tiếp!

---
*Tài liệu Game Math & Balance được cập nhật chính thức vào hệ thống Master Docs của dự án Echoes of Genesis.*
