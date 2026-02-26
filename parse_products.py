import csv
import json
import re

def clean_text(text):
    """Clean HTML and extra whitespace from text"""
    if not text:
        return ""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Remove extra whitespace
    text = ' '.join(text.split())
    return text.strip()

def extract_features(row):
    """Extract features from the CSV row"""
    features = []
    
    # Try different feature columns
    for i in range(1, 6):
        key = f'Key Product Features' if i == 1 else f'Key Product Features'
        feature = row.get(key, '').strip()
        if feature and feature not in features:
            features.append(clean_text(feature))
    
    # Also try Feature columns
    for i in range(1, 6):
        feature = row.get(f'Feature {i}', '') or row.get(f'Feauture {i}', '')
        if feature and feature.strip() and clean_text(feature.strip()) not in features:
            features.append(clean_text(feature.strip()))
    
    return features[:4]  # Limit to 4 features

def parse_hubcaps(filepath):
    """Parse hubcaps CSV"""
    products = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            if not row.get('Product Name'):
                continue
                
            product_id = f"hc-{str(idx+1).zfill(3)}"
            name = clean_text(row.get('Product Name', ''))
            price = float(row.get('Sell Price', '0').replace('$', '').replace(',', '') or '0')
            description = clean_text(row.get('Product Description', ''))
            image = row.get('Main Image URL', '')
            features = extract_features(row)
            
            if name and price > 0:
                products.append({
                    'id': product_id,
                    'name': name,
                    'price': price,
                    'description': description[:200] if description else f"Premium {name}",
                    'image': image if image else 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500',
                    'features': features if features else ['Premium quality', 'Easy installation', 'Durable construction', 'Universal fit'],
                    'rating': round(4.5 + (idx % 5) * 0.1, 1),
                    'reviews': 50 + (idx * 10)
                })
    
    return products

def parse_wheelskins(filepath):
    """Parse wheelskins (impostors) CSV"""
    products = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            if not row.get('Product Name'):
                continue
                
            product_id = f"ws-{str(idx+1).zfill(3)}"
            name = clean_text(row.get('Product Name', ''))
            price = float(row.get('Sell Price', '0').replace('$', '').replace(',', '') or '0')
            description = clean_text(row.get('Product Description', ''))
            image = row.get('Main Image URL', '')
            features = extract_features(row)
            
            if name and price > 0:
                products.append({
                    'id': product_id,
                    'name': name,
                    'price': price,
                    'description': description[:200] if description else f"Premium {name}",
                    'image': image if image else 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500',
                    'features': features if features else ['Premium quality', 'Easy installation', 'Durable construction', 'Perfect fit'],
                    'rating': round(4.5 + (idx % 5) * 0.1, 1),
                    'reviews': 50 + (idx * 8)
                })
    
    return products

def parse_simulators_and_trimrings(filepath):
    """Parse wheel simulators and trim rings CSV"""
    simulators = []
    trim_rings = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        sim_idx = 0
        trim_idx = 0
        
        for row in reader:
            if not row.get('Product Name'):
                continue
            
            product_type = row.get('Product Type', '')
            name = clean_text(row.get('Product Name', ''))
            price = float(row.get('Sell Price', '0').replace('$', '').replace(',', '') or '0')
            description = clean_text(row.get('Product Description', ''))
            image = row.get('Main Image URL', '')
            features = extract_features(row)
            
            if not name or price <= 0:
                continue
            
            if 'Wheel Simulator' in product_type:
                sim_idx += 1
                product = {
                    'id': f"sim-{str(sim_idx).zfill(3)}",
                    'name': name,
                    'price': price,
                    'description': description[:200] if description else f"Premium {name}",
                    'image': image if image else 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
                    'features': features if features else ['Premium quality', 'Easy installation', 'Durable construction', 'Perfect fit'],
                    'rating': round(4.6 + (sim_idx % 5) * 0.1, 1),
                    'reviews': 60 + (sim_idx * 12)
                }
                simulators.append(product)
            
            elif 'Trim Ring' in product_type:
                trim_idx += 1
                product = {
                    'id': f"tr-{str(trim_idx).zfill(3)}",
                    'name': name,
                    'price': price,
                    'description': description[:200] if description else f"Premium {name}",
                    'image': image if image else 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500',
                    'features': features if features else ['Premium quality', 'Easy installation', 'Durable construction', 'Perfect fit'],
                    'rating': round(4.5 + (trim_idx % 5) * 0.1, 1),
                    'reviews': 55 + (trim_idx * 10)
                }
                trim_rings.append(product)
    
    return simulators, trim_rings

# Parse all files
print("Parsing Hubcaps...")
hubcaps = parse_hubcaps(r'C:\Users\Admin\OPH Files\Hubcaps.csv')
print(f"Found {len(hubcaps)} hubcaps")

print("\nParsing Wheelskins...")
wheelskins = parse_wheelskins(r'C:\Users\Admin\OPH Files\Wheelskins.csv')
print(f"Found {len(wheelskins)} wheelskins")

print("\nParsing Simulators and Trim Rings...")
simulators, trim_rings = parse_simulators_and_trimrings(r'C:\Users\Admin\OPH Files\Wheel Simulators & Trim Rings.csv')
print(f"Found {len(simulators)} wheel simulators")
print(f"Found {len(trim_rings)} trim rings")

# Create the products object
products_data = {
    'hubcaps': hubcaps,
    'wheelskins': wheelskins,
    'wheelSimulator': simulators,
    'trimRings': trim_rings
}

# Save to JSON for review
with open('products_parsed.json', 'w', encoding='utf-8') as f:
    json.dump(products_data, f, indent=2, ensure_ascii=False)

print(f"\n✅ Total products: {len(hubcaps) + len(wheelskins) + len(simulators) + len(trim_rings)}")
print("✅ Saved to products_parsed.json")
