/*
  # Populate Mock Data

  1. Carriers
    - Insert all travelers from mock data
  2. Trips
    - Insert all trips with proper city/country references
  3. Trip Stops
    - Insert all stops with proper relationships
  4. Trip Contacts
    - Insert all contact methods
*/

-- Insert Carriers
INSERT INTO carriers (id, username, full_name, phone, whatsapp, messenger, rating, total_trips, verified) VALUES
(gen_random_uuid(), 'TransportsJN', 'Ahmed Bali', '33123456789', '33123456789', 'ahmed.bali', 5.00, 15, true),
(gen_random_uuid(), 'FatimaTravels', 'Fatima Ben Ali', '216123456789', '216123456789', 'fatima.benali', 4.8, 12, true),
(gen_random_uuid(), 'MohamedExpress', 'Mohamed Kara', '212123456789', '212123456789', 'mohamed.kara', 4.9, 18, true),
(gen_random_uuid(), 'TransportFrance', 'Youssef Transport', '33987654321', '33987654321', 'youssef.transport', 4.7, 22, true),
(gen_random_uuid(), 'AminaVoyages', 'Amina Cherif', '34612345678', '34612345678', 'amina.cherif', 4.6, 8, true),
(gen_random_uuid(), 'HassanLogistics', 'Hassan Mansouri', '32123456789', '32123456789', 'hassan.mansouri', 4.9, 14, true),
(gen_random_uuid(), 'LeilaTrans', 'Leila Bouaziz', '39123456789', '39123456789', 'leila.bouaziz', 4.5, 11, true),
(gen_random_uuid(), 'OmarExpress', 'Omar Benali', '41123456789', '41123456789', 'omar.benali', 4.8, 16, true),
(gen_random_uuid(), 'NadiaLogistics', 'Nadia Hamdi', '31123456789', '31123456789', 'nadia.hamdi', 4.7, 13, true),
(gen_random_uuid(), 'KarimTransport', 'Karim Zouari', '39987654321', '39987654321', 'karim.zouari', 4.6, 9, true),
(gen_random_uuid(), 'SalmaVoyages', 'Salma Radi', '49123456789', '49123456789', 'salma.radi', 4.8, 17, true),
(gen_random_uuid(), 'MehdiExpress', 'Mehdi Slimani', '34987654321', '34987654321', 'mehdi.slimani', 4.5, 7, true),
(gen_random_uuid(), 'AichaLogistics', 'Aicha Trabelsi', '43123456789', '43123456789', 'aicha.trabelsi', 4.9, 12, true),
(gen_random_uuid(), 'RachidTransport', 'Rachid Benkirane', '351123456789', '351123456789', 'rachid.benkirane', 4.7, 15, true),
(gen_random_uuid(), 'YasmineVoyages', 'Yasmine Khelifi', '46123456789', '46123456789', 'yasmine.khelifi', 4.8, 10, true),
(gen_random_uuid(), 'SamirExpress', 'Samir Boumediene', '33456789123', '33456789123', 'samir.boumediene', 4.6, 14, true),
(gen_random_uuid(), 'KhadijaTransport', 'Khadija Alami', '33789123456', '33789123456', 'khadija.alami', 4.7, 11, true),
(gen_random_uuid(), 'TarekLogistics', 'Tarek Gharbi', '33321654987', '33321654987', 'tarek.gharbi', 4.9, 19, true),
(gen_random_uuid(), 'YoussefEurope', 'Youssef Alami', '49987654321', '49987654321', 'youssef.alami', 4.8, 13, true),
(gen_random_uuid(), 'SarraBelgique', 'Sarra Mejri', '32456789123', '32456789123', 'sarra.mejri', 4.5, 8, true),
(gen_random_uuid(), 'KarimPortugal', 'Karim Benaissa', '351789123456', '351789123456', 'karim.benaissa', 4.7, 12, true),
(gen_random_uuid(), 'AminaRetour', 'Amina Larbi', '33654321987', '33654321987', 'amina.larbi', 4.6, 9, true),
(gen_random_uuid(), 'HassanRetour', 'Hassan Tazi', '212987654321', '212987654321', 'hassan.tazi', 4.8, 16, true),
(gen_random_uuid(), 'FatmaItalie', 'Fatma Bouali', '216456789123', '216456789123', 'fatma.bouali', 4.9, 14, true),
(gen_random_uuid(), 'OmarMaghreb', 'Omar Benali', '212123789456', '212123789456', 'omar.benali.maghreb', 4.7, 11, true),
(gen_random_uuid(), 'LeilaMaghreb', 'Leila Cherif', '216789456123', '216789456123', 'leila.cherif.maghreb', 4.5, 7, true),
(gen_random_uuid(), 'NadiaSuisse', 'Nadia Hamidi', '41789456123', '41789456123', 'nadia.hamidi', 4.8, 15, true),
(gen_random_uuid(), 'MehdiBelgique', 'Mehdi Sassi', '32123789456', '32123789456', 'mehdi.sassi', 4.6, 10, true),
(gen_random_uuid(), 'KarimFrance', 'Karim Boudali', '33456123789', '33456123789', 'karim.boudali', 4.9, 18, true),
(gen_random_uuid(), 'SamiraTransport', 'Samira Hadj', '33789456123', '33789456123', 'samira.hadj', 4.7, 13, true),
(gen_random_uuid(), 'YoussefEspana', 'Youssef Benali', '34123789456', '34123789456', 'youssef.benali.es', 4.8, 16, true),
(gen_random_uuid(), 'AichaSpain', 'Aicha Rami', '34987123456', '34987123456', 'aicha.rami', 4.5, 9, true),
(gen_random_uuid(), 'MohamedTunisie', 'Mohamed Triki', '216123789456', '216123789456', 'mohamed.triki', 4.7, 12, true),
(gen_random_uuid(), 'SalmaTunisia', 'Salma Jebali', '216789123456', '216789123456', 'salma.jebali', 4.6, 8, true),
(gen_random_uuid(), 'RamiItalia', 'Rami Bouazizi', '39123456789', '39123456789', 'rami.bouazizi', 4.8, 14, true),
(gen_random_uuid(), 'NadiaEspana', 'Nadia Benali', '34456789123', '34456789123', 'nadia.benali.es', 4.9, 17, true),
(gen_random_uuid(), 'KhalidFrance', 'Khalid Alaoui', '33654789123', '33654789123', 'khalid.alaoui', 4.7, 11, true),
(gen_random_uuid(), 'ZinebFrance', 'Zineb Tazi', '33321789456', '33321789456', 'zineb.tazi', 4.8, 15, true),
(gen_random_uuid(), 'FaridAllemagne', 'Farid Khelifi', '49789123456', '49789123456', 'farid.khelifi', 4.6, 10, true),
(gen_random_uuid(), 'AminaGermany', 'Amina Boudiaf', '49456123789', '49456123789', 'amina.boudiaf', 4.9, 13, true),
(gen_random_uuid(), 'RachidBelgique', 'Rachid Benkirane', '32789456123', '32789456123', 'rachid.benkirane.be', 4.7, 12, true),
(gen_random_uuid(), 'LailaBelgium', 'Laila Cherkaoui', '32123789456', '32123789456', 'laila.cherkaoui', 4.8, 16, true);

-- Now insert trips with proper references
-- Trip 1: Annaba → Paris (Direct)
DO $$
DECLARE
    carrier_id UUID;
    trip_id UUID;
BEGIN
    SELECT id INTO carrier_id FROM carriers WHERE username = 'TransportsJN';
    trip_id := gen_random_uuid();
    
    INSERT INTO trips (
        id, url_id, traveler_id, 
        origin_city_id, destination_city_id,
        departure_date, price_per_kg, currency, available_kg, notes,
        origin_flag, destination_flag, status
    ) VALUES (
        trip_id, 'trip-annaba-paris-001', carrier_id,
        (SELECT id FROM cities WHERE name_en = 'Annaba'),
        (SELECT id FROM cities WHERE name_en = 'Paris'),
        '2025-09-15', 4.00, 'EUR', 20,
        'Voyage direct sans escale. Transport sécurisé garanti avec plus de 5 ans d''expérience.',
        '🇩🇿', '🇫🇷', 'active'
    );
    
    -- Add contacts
    INSERT INTO trip_contacts (trip_id, contact_type, contact_value, contact_label) VALUES
    (trip_id, 'phone', '33123456789', 'Téléphone'),
    (trip_id, 'whatsapp', '33123456789', 'WhatsApp'),
    (trip_id, 'messenger', 'ahmed.bali', 'Messenger');
END $$;

-- Trip 2: Tunis → Lyon (Direct)
DO $$
DECLARE
    carrier_id UUID;
    trip_id UUID;
BEGIN
    SELECT id INTO carrier_id FROM carriers WHERE username = 'FatimaTravels';
    trip_id := gen_random_uuid();
    
    INSERT INTO trips (
        id, url_id, traveler_id, 
        origin_city_id, destination_city_id,
        departure_date, price_per_kg, currency, available_kg, notes,
        origin_flag, destination_flag, status
    ) VALUES (
        trip_id, 'trip-tunis-lyon-001', carrier_id,
        (SELECT id FROM cities WHERE name_en = 'Tunis'),
        (SELECT id FROM cities WHERE name_en = 'Lyon'),
        '2025-09-18', 5.50, 'EUR', 15,
        'Transport direct Tunis-Lyon. Service fiable et prix abordables.',
        '🇹🇳', '🇫🇷', 'active'
    );
    
    -- Add contacts
    INSERT INTO trip_contacts (trip_id, contact_type, contact_value, contact_label) VALUES
    (trip_id, 'phone', '216123456789', 'Téléphone'),
    (trip_id, 'whatsapp', '216123456789', 'WhatsApp'),
    (trip_id, 'messenger', 'fatima.benali', 'Messenger');
END $$;

-- Trip 7: Sfax → Milan via Naples, Rome
DO $$
DECLARE
    carrier_id UUID;
    trip_id UUID;
BEGIN
    SELECT id INTO carrier_id FROM carriers WHERE username = 'LeilaTrans';
    trip_id := gen_random_uuid();
    
    INSERT INTO trips (
        id, url_id, traveler_id, 
        origin_city_id, destination_city_id,
        departure_date, price_per_kg, currency, available_kg, notes,
        origin_flag, destination_flag, status
    ) VALUES (
        trip_id, 'trip-sfax-milan-001', carrier_id,
        (SELECT id FROM cities WHERE name_en = 'Sfax'),
        (SELECT id FROM cities WHERE name_en = 'Milan'),
        '2025-10-05', 3.80, 'EUR', 16,
        'Voyage avec escales à Naples et Rome. Spécialisée dans les produits artisanaux.',
        '🇹🇳', '🇮🇹', 'active'
    );
    
    -- Add stops
    INSERT INTO trip_stops (trip_id, city_id, stop_order, stop_type, instructions) VALUES
    (trip_id, (SELECT id FROM cities WHERE name_en = 'Naples'), 1, 'pickup', 'Meet at port entrance'),
    (trip_id, (SELECT id FROM cities WHERE name_en = 'Rome'), 2, 'both', 'Roma Termini Station');
    
    -- Add contacts
    INSERT INTO trip_contacts (trip_id, contact_type, contact_value, contact_label) VALUES
    (trip_id, 'phone', '39123456789', 'Telefono'),
    (trip_id, 'whatsapp', '39123456789', 'WhatsApp'),
    (trip_id, 'messenger', 'leila.bouaziz', 'Messenger');
END $$;

-- Trip 10: Sousse → Rome via Palermo, Naples
DO $$
DECLARE
    carrier_id UUID;
    trip_id UUID;
BEGIN
    SELECT id INTO carrier_id FROM carriers WHERE username = 'KarimTransport';
    trip_id := gen_random_uuid();
    
    INSERT INTO trips (
        id, url_id, traveler_id, 
        origin_city_id, destination_city_id,
        departure_date, price_per_kg, currency, available_kg, notes,
        origin_flag, destination_flag, status
    ) VALUES (
        trip_id, 'trip-sousse-rome-001', carrier_id,
        (SELECT id FROM cities WHERE name_en = 'Sousse'),
        (SELECT id FROM cities WHERE name_en = 'Rome'),
        '2025-10-12', 4.00, 'EUR', 14,
        'Liaison Tunisie-Italie avec escales à Palerme et Naples. 8 ans d''expérience.',
        '🇹🇳', '🇮🇹', 'active'
    );
    
    -- Add stops
    INSERT INTO trip_stops (trip_id, city_id, stop_order, stop_type, address) VALUES
    (trip_id, (SELECT id FROM cities WHERE name_en = 'Palermo'), 1, 'pickup', 'Port of Palermo'),
    (trip_id, (SELECT id FROM cities WHERE name_en = 'Naples'), 2, 'both', NULL);
    
    -- Add contacts
    INSERT INTO trip_contacts (trip_id, contact_type, contact_value, contact_label) VALUES
    (trip_id, 'phone', '39987654321', 'Telefono'),
    (trip_id, 'whatsapp', '39987654321', 'WhatsApp'),
    (trip_id, 'messenger', 'karim.zouari', 'Messenger');
END $$;

-- Trip 13: Monastir → Vienna via Milan
DO $$
DECLARE
    carrier_id UUID;
    trip_id UUID;
BEGIN
    SELECT id INTO carrier_id FROM carriers WHERE username = 'AichaLogistics';
    trip_id := gen_random_uuid();
    
    INSERT INTO trips (
        id, url_id, traveler_id, 
        origin_city_id, destination_city_id,
        departure_date, price_per_kg, currency, available_kg, notes,
        origin_flag, destination_flag, status
    ) VALUES (
        trip_id, 'trip-monastir-vienna-001', carrier_id,
        (SELECT id FROM cities WHERE name_en = 'Monastir'),
        (SELECT id FROM cities WHERE name_en = 'Vienna'),
        '2025-10-20', 5.90, 'EUR', 13,
        'Transport vers l''Autriche avec escale à Milan. Service personnalisé.',
        '🇹🇳', '🇦🇹', 'active'
    );
    
    -- Add stops
    INSERT INTO trip_stops (trip_id, city_id, stop_order, stop_type) VALUES
    (trip_id, (SELECT id FROM cities WHERE name_en = 'Milan'), 1, 'both');
    
    -- Add contacts
    INSERT INTO trip_contacts (trip_id, contact_type, contact_value, contact_label) VALUES
    (trip_id, 'phone', '43123456789', 'Telefon'),
    (trip_id, 'whatsapp', '43123456789', 'WhatsApp'),
    (trip_id, 'messenger', 'aicha.trabelsi', 'Messenger');
END $$;

-- Add a few more sample trips for testing
-- Trip: Casablanca → Madrid (Direct)
DO $$
DECLARE
    carrier_id UUID;
    trip_id UUID;
BEGIN
    SELECT id INTO carrier_id FROM carriers WHERE username = 'MohamedExpress';
    trip_id := gen_random_uuid();
    
    INSERT INTO trips (
        id, url_id, traveler_id, 
        origin_city_id, destination_city_id,
        departure_date, price_per_kg, currency, available_kg, notes,
        origin_flag, destination_flag, status
    ) VALUES (
        trip_id, 'trip-casablanca-madrid-001', carrier_id,
        (SELECT id FROM cities WHERE name_en = 'Casablanca'),
        (SELECT id FROM cities WHERE name_en = 'Madrid'),
        '2025-09-20', 4.00, 'EUR', 25,
        'Voyage direct Casablanca-Madrid. Transport sécurisé et rapide.',
        '🇲🇦', '🇪🇸', 'active'
    );
    
    -- Add contacts
    INSERT INTO trip_contacts (trip_id, contact_type, contact_value, contact_label) VALUES
    (trip_id, 'phone', '212123456789', 'Téléphone'),
    (trip_id, 'whatsapp', '212123456789', 'WhatsApp'),
    (trip_id, 'messenger', 'mohamed.kara', 'Messenger');
END $$;

-- Trip: Algiers → Marseille via Barcelona
DO $$
DECLARE
    carrier_id UUID;
    trip_id UUID;
BEGIN
    SELECT id INTO carrier_id FROM carriers WHERE username = 'TransportFrance';
    trip_id := gen_random_uuid();
    
    INSERT INTO trips (
        id, url_id, traveler_id, 
        origin_city_id, destination_city_id,
        departure_date, price_per_kg, currency, available_kg, notes,
        origin_flag, destination_flag, status
    ) VALUES (
        trip_id, 'trip-algiers-marseille-001', carrier_id,
        (SELECT id FROM cities WHERE name_en = 'Algiers'),
        (SELECT id FROM cities WHERE name_en = 'Marseille'),
        '2025-09-22', 5.00, 'EUR', 30,
        'Service premium avec escale à Barcelone. Assurance complète incluse.',
        '🇩🇿', '🇫🇷', 'active'
    );
    
    -- Add stops
    INSERT INTO trip_stops (trip_id, city_id, stop_order, stop_type, address, availability_time, instructions) VALUES
    (trip_id, (SELECT id FROM cities WHERE name_en = 'Barcelona'), 1, 'both', 'Estació del Nord, Barcelona', '24-26 août / 14:00-18:00', 'Call 30 minutes before arrival');
    
    -- Add contacts
    INSERT INTO trip_contacts (trip_id, contact_type, contact_value, contact_label) VALUES
    (trip_id, 'phone', '33987654321', 'Téléphone'),
    (trip_id, 'whatsapp', '33987654321', 'WhatsApp'),
    (trip_id, 'messenger', 'youssef.transport', 'Messenger');
END $$;
