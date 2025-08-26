/*
  # Populate Reference Data

  1. Countries
    - Insert all countries with translations and flags
  2. Cities  
    - Insert all cities with coordinates and translations
  3. Initial Data
    - Countries: Algeria, Tunisia, Morocco, France, Spain, Italy, Germany, Belgium, Netherlands, Switzerland, Austria, Portugal, Sweden, Denmark
    - Cities: Major cities from each country with coordinates and translations
*/

-- Insert Countries
INSERT INTO countries (code, name_en, name_fr, name_ar, flag_emoji) VALUES
('DZ', 'Algeria', 'Algérie', 'الجزائر', '🇩🇿'),
('TN', 'Tunisia', 'Tunisie', 'تونس', '🇹🇳'),
('MA', 'Morocco', 'Maroc', 'المغرب', '🇲🇦'),
('FR', 'France', 'France', 'فرنسا', '🇫🇷'),
('ES', 'Spain', 'Espagne', 'إسبانيا', '🇪🇸'),
('IT', 'Italy', 'Italie', 'إيطاليا', '🇮🇹'),
('DE', 'Germany', 'Allemagne', 'ألمانيا', '🇩🇪'),
('BE', 'Belgium', 'Belgique', 'بلجيكا', '🇧🇪'),
('NL', 'Netherlands', 'Pays-Bas', 'هولندا', '🇳🇱'),
('CH', 'Switzerland', 'Suisse', 'سويسرا', '🇨🇭'),
('AT', 'Austria', 'Autriche', 'النمسا', '🇦🇹'),
('PT', 'Portugal', 'Portugal', 'البرتغال', '🇵🇹'),
('SE', 'Sweden', 'Suède', 'السويد', '🇸🇪'),
('DK', 'Denmark', 'Danemark', 'الدنمارك', '🇩🇰');

-- Insert Cities
-- Algeria
INSERT INTO cities (country_id, name_en, name_fr, name_ar, latitude, longitude, aliases) VALUES
((SELECT id FROM countries WHERE code = 'DZ'), 'Algiers', 'Alger', 'الجزائر', 36.7538, 3.0588, ARRAY['Alger', 'الجزائر', 'alger']),
((SELECT id FROM countries WHERE code = 'DZ'), 'Oran', 'Oran', 'وهران', 35.6969, -0.6331, ARRAY['وهران']),
((SELECT id FROM countries WHERE code = 'DZ'), 'Constantine', 'Constantine', 'قسنطينة', 36.3650, 6.6147, ARRAY['قسنطينة']),
((SELECT id FROM countries WHERE code = 'DZ'), 'Annaba', 'Annaba', 'عنابة', 36.9000, 7.7667, ARRAY['عنابة', 'Bône']),
((SELECT id FROM countries WHERE code = 'DZ'), 'Tlemcen', 'Tlemcen', 'تلمسان', 34.8833, -1.3167, ARRAY['تلمسان']),
((SELECT id FROM countries WHERE code = 'DZ'), 'Béjaïa', 'Béjaïa', 'بجاية', 36.7525, 5.0667, ARRAY['بجاية', 'Bougie']),
((SELECT id FROM countries WHERE code = 'DZ'), 'Blida', 'Blida', 'البليدة', 36.4203, 2.8277, ARRAY['البليدة']);

-- Tunisia
INSERT INTO cities (country_id, name_en, name_fr, name_ar, latitude, longitude, aliases) VALUES
((SELECT id FROM countries WHERE code = 'TN'), 'Tunis', 'Tunis', 'تونس', 36.8065, 10.1815, ARRAY['تونس']),
((SELECT id FROM countries WHERE code = 'TN'), 'Sfax', 'Sfax', 'صفاقس', 34.7406, 10.7603, ARRAY['صفاقس']),
((SELECT id FROM countries WHERE code = 'TN'), 'Sousse', 'Sousse', 'سوسة', 35.8256, 10.6369, ARRAY['سوسة']),
((SELECT id FROM countries WHERE code = 'TN'), 'Monastir', 'Monastir', 'المنستير', 35.7643, 10.8113, ARRAY['المنستير']),
((SELECT id FROM countries WHERE code = 'TN'), 'Bizerte', 'Bizerte', 'بنزرت', 37.2744, 9.8739, ARRAY['بنزرت']);

-- Morocco
INSERT INTO cities (country_id, name_en, name_fr, name_ar, latitude, longitude, aliases) VALUES
((SELECT id FROM countries WHERE code = 'MA'), 'Casablanca', 'Casablanca', 'الدار البيضاء', 33.5731, -7.5898, ARRAY['الدار البيضاء']),
((SELECT id FROM countries WHERE code = 'MA'), 'Rabat', 'Rabat', 'الرباط', 34.0209, -6.8416, ARRAY['الرباط']),
((SELECT id FROM countries WHERE code = 'MA'), 'Marrakech', 'Marrakech', 'مراكش', 31.6295, -7.9811, ARRAY['مراكش', 'Marrakesh']),
((SELECT id FROM countries WHERE code = 'MA'), 'Fès', 'Fès', 'فاس', 34.0181, -5.0078, ARRAY['فاس', 'Fez']),
((SELECT id FROM countries WHERE code = 'MA'), 'Tangier', 'Tanger', 'طنجة', 35.7595, -5.8340, ARRAY['طنجة', 'Tanger']),
((SELECT id FROM countries WHERE code = 'MA'), 'Agadir', 'Agadir', 'أكادير', 30.4278, -9.5981, ARRAY['أكادير']);

-- France
INSERT INTO cities (country_id, name_en, name_fr, name_ar, latitude, longitude, aliases) VALUES
((SELECT id FROM countries WHERE code = 'FR'), 'Paris', 'Paris', 'باريس', 48.8566, 2.3522, ARRAY['باريس']),
((SELECT id FROM countries WHERE code = 'FR'), 'Marseille', 'Marseille', 'مرسيليا', 43.2965, 5.3698, ARRAY['مرسيليا']),
((SELECT id FROM countries WHERE code = 'FR'), 'Lyon', 'Lyon', 'ليون', 45.7640, 4.8357, ARRAY['ليون']),
((SELECT id FROM countries WHERE code = 'FR'), 'Toulouse', 'Toulouse', 'تولوز', 43.6047, 1.4442, ARRAY['تولوز']),
((SELECT id FROM countries WHERE code = 'FR'), 'Nice', 'Nice', 'نيس', 43.7102, 7.2620, ARRAY['نيس']);

-- Spain
INSERT INTO cities (country_id, name_en, name_fr, name_ar, latitude, longitude, aliases) VALUES
((SELECT id FROM countries WHERE code = 'ES'), 'Madrid', 'Madrid', 'مدريد', 40.4168, -3.7038, ARRAY['مدريد']),
((SELECT id FROM countries WHERE code = 'ES'), 'Barcelona', 'Barcelone', 'برشلونة', 41.3851, 2.1734, ARRAY['برشلونة', 'Barcelone', 'barcelone']),
((SELECT id FROM countries WHERE code = 'ES'), 'Valencia', 'Valence', 'بلنسية', 39.4699, -0.3763, ARRAY['بلنسية']),
((SELECT id FROM countries WHERE code = 'ES'), 'Seville', 'Séville', 'إشبيلية', 37.3891, -5.9845, ARRAY['إشبيلية', 'Sevilla']);

-- Italy
INSERT INTO cities (country_id, name_en, name_fr, name_ar, latitude, longitude, aliases) VALUES
((SELECT id FROM countries WHERE code = 'IT'), 'Rome', 'Rome', 'روما', 41.9028, 12.4964, ARRAY['Roma', 'روما']),
((SELECT id FROM countries WHERE code = 'IT'), 'Milan', 'Milan', 'ميلانو', 45.4642, 9.1900, ARRAY['Milano', 'ميلانو']),
((SELECT id FROM countries WHERE code = 'IT'), 'Naples', 'Naples', 'نابولي', 40.8518, 14.2681, ARRAY['Napoli', 'نابولي']),
((SELECT id FROM countries WHERE code = 'IT'), 'Palermo', 'Palerme', 'باليرمو', 38.1157, 13.3613, ARRAY['باليرمو']);

-- Germany
INSERT INTO cities (country_id, name_en, name_fr, name_ar, latitude, longitude, aliases) VALUES
((SELECT id FROM countries WHERE code = 'DE'), 'Berlin', 'Berlin', 'برلين', 52.5200, 13.4050, ARRAY['برلين']),
((SELECT id FROM countries WHERE code = 'DE'), 'Frankfurt', 'Francfort', 'فرانكفورت', 50.1109, 8.6821, ARRAY['فرانكفورت']);

-- Other European cities
INSERT INTO cities (country_id, name_en, name_fr, name_ar, latitude, longitude, aliases) VALUES
((SELECT id FROM countries WHERE code = 'BE'), 'Brussels', 'Bruxelles', 'بروكسل', 50.8503, 4.3517, ARRAY['Bruxelles', 'بروكسل']),
((SELECT id FROM countries WHERE code = 'NL'), 'Amsterdam', 'Amsterdam', 'أمستردام', 52.3676, 4.9041, ARRAY['أمستردام']),
((SELECT id FROM countries WHERE code = 'CH'), 'Geneva', 'Genève', 'جنيف', 46.2044, 6.1432, ARRAY['Genève', 'جنيف']),
((SELECT id FROM countries WHERE code = 'CH'), 'Zurich', 'Zurich', 'زيورخ', 47.3769, 8.5417, ARRAY['زيورخ']),
((SELECT id FROM countries WHERE code = 'AT'), 'Vienna', 'Vienne', 'فيينا', 48.2082, 16.3738, ARRAY['Wien', 'فيينا']),
((SELECT id FROM countries WHERE code = 'PT'), 'Lisbon', 'Lisbonne', 'لشبونة', 38.7223, -9.1393, ARRAY['Lisboa', 'لشبونة']),
((SELECT id FROM countries WHERE code = 'SE'), 'Stockholm', 'Stockholm', 'ستوكهولم', 59.3293, 18.0686, ARRAY['ستوكهولم']),
((SELECT id FROM countries WHERE code = 'DK'), 'Copenhagen', 'Copenhague', 'كوبنهاغن', 55.6761, 12.5683, ARRAY['København', 'كوبنهاغن']);
