-- INSERT INTO users (id, email, firstname, lastname, password, profile_picurl, username)
-- VALUES (1, 'user1@example.com', 'First1', 'Last1', 'password1', NULL, 'user1'),
--        (2, 'user2@example.com', 'First2', 'Last2', 'password2', NULL, 'user2');

INSERT INTO pcpart (price, id, part_type, imageurl, name)
VALUES (511.10, 1, 'CPU', '/images/pc_parts/1_cpu.jpg', 'AMD Ryzen 7 7800X3D'),
       (299.99, 2, 'COOLER', '/images/pc_parts/2_cooler.jpg', 'NZXT Kraken Elite 360 RGB'),
       (233.48, 3, 'MOTHERBOARD', '/images/pc_parts/3_motherboard.jpg', 'Asus ROG STRIX B650-A GAMING WIFI'),
       (99.99, 4, 'MEMORY', '/images/pc_parts/4_memory.jpg', 'G.Skill Trident Z5 RGB 32 GB'),
       (136.99, 5, 'STORAGE', '/images/pc_parts/5_storage.jpg', 'Acer Predator GM7000'),
       (1249.00, 6, 'GPU', '/images/pc_parts/6_gpu.jpg', 'GALAX EX Gamer 1-Click OC V2'),
       (379.99, 7, 'CASE', '/images/pc_parts/7_case.jpg', 'HYTE Y70 Touch Infinite'),
       (139.99, 8, 'POWER_SUPPLY', '/images/pc_parts/8_powersupply.jpg', 'Corsair RM1000x (2021)'),
       (185.00, 9, 'OS', '/images/pc_parts/9_os.jpg', 'Microsoft Windows 10 Home OEM - DVD 64-bit');

INSERT INTO cpu (core_count, performance_core_boost_clock, performance_core_clock, tdp, id, integrated_graphics, micro_architecture)
VALUES (8, 5.0, 4.2, 120, 1, 'Radeon', 'Zen 4');

INSERT INTO cooler (fanrpm, noise_level, radiator_size, id, colour)
VALUES (1800, 30.6, 360, 2, 'White');

INSERT INTO motherboard (memory_max, memory_slots, id, colour, form_factor, socket)
VALUES (192, 4, 3, 'Black/Silver', 'ATX', 'AM5');

INSERT INTO memory (caslatency, first_word_latency, module_size, num_modules, id, colour, speed)
VALUES (36, 12, 16, 2, 4, 'Black', 'DDR5-6000');

INSERT INTO storage (cache, capacity, id, connection_interface, form_factor, type)
VALUES (2048, 2000, 5, 'M.2 PCIe 4.0 X4', 'M.2-2280', 'SSD');

INSERT INTO gpu (boost_clock, core_clock, length, memory, id, chipset, colour)
VALUES (2670, 2310, 323, 12, 6, 'GeForce RTX 4070 Ti', 'White');

INSERT INTO cases (external_volume, num_internal_bays, power_supply, id, colour, side_panel_material, type)
VALUES (70.7, 2, NULL, 7, 'White', 'Tempered Glass', 'ATX Mid Tower');

INSERT INTO power_supply (wattage, id, colour, efficiency_rating, modular, type)
VALUES (1000, 8, 'Black', '80+ Gold', 'Full', 'ATX');

INSERT INTO os (max_supported_mem, id, mode)
VALUES (128, 9, '64-bit');

