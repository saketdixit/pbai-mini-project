from sqlmodel import Session, select
from app.core.config import settings
from app.core.database import engine, init_db
from app.core.security import hash_password
from app.models.admin import AdminUser
from app.models.product import Product
from app.models.content import SiteContent
from app.api.content import DEFAULT_ABOUT_STORY, DEFAULT_VALUES, DEFAULT_CONTACT

INITIAL_PRODUCTS = [
    {
        "name": "Makaibari Estate First Flush",
        "slug": "makaibari-estate-first-flush",
        "category": "Black Tea",
        "origin": "Kurseong Division, Darjeeling (5,200 ft)",
        "flush": "First Flush 2026",
        "grade": "FTGFOP1 Super Fine",
        "short_description": "The champagne of teas. Crisp muscatel sweetness, notes of raw mountain honey, and a light amber liquor.",
        "description": "Harvested during the tender spring waking of the bushes following Himalayan winter dormancy. Hand-picked at dawn before the dew dries on the slopes of the historic Makaibari estate. The cup offers an ethereal floral bouquet, delicate muscatel grape brightness, and lingering sweet orchid finish.",
        "flavor_notes": ["Muscatel Grape", "Spring Orchid", "Raw Honey", "Wild Apricot"],
        "brewing_guide": {
            "temp": "85°C / 185°F",
            "steep_time": "3 mins",
            "ratio": "2.5g per 200ml",
            "infusions": 3
        },
        "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80",
        "is_featured": True,
        "display_order": 1,
        "is_available": True
    },
    {
        "name": "Nilgiri Frost Winter Harvest",
        "slug": "nilgiri-frost-winter-harvest",
        "category": "Black Tea",
        "origin": "Kodanad Highlands, Nilgiri (6,800 ft)",
        "flush": "Winter Frost Pluck",
        "grade": "Orange Pekoe Orthodox",
        "short_description": "Plucked during sub-zero frost nights. Intensely aromatic with crisp eucalyptus, sweet fruit, and bright golden clarity.",
        "description": "Unique to the Blue Mountains of Southern India, frost teas undergo extreme natural stress during freezing January winds, concentrating the volatile essential oils within the leaf. Infuses into an incandescent golden cup with lively citrus top notes and smooth wintergreen finish.",
        "flavor_notes": ["Wintergreen", "Ripe Guava", "Citrus Blossom", "Golden Honey"],
        "brewing_guide": {
            "temp": "90°C / 194°F",
            "steep_time": "3.5 mins",
            "ratio": "3g per 200ml",
            "infusions": 4
        },
        "image_url": "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=900&q=80",
        "is_featured": True,
        "display_order": 2,
        "is_available": True
    },
    {
        "name": "Imperial Silver Needle",
        "slug": "imperial-silver-needle",
        "category": "White Tea",
        "origin": "Kangra Valley, Western Himalayas (4,800 ft)",
        "flush": "Early Spring Bud",
        "grade": "Pure Downy Tips",
        "short_description": "Only unopened silvery buds covered in downy hair. Delicate, velvety sweetness with hints of melon and cucumber.",
        "description": "The rarest tier of artisanal harvest. Only whole, pristine unopened buds are clipped in the earliest spring dawn. Gently sun-withered on bamboo racks with zero mechanical rolling or oxidation. The tea liquor is pale silver-jade, offering extraordinary texture, subtle sweetness, and soothing restorative properties.",
        "flavor_notes": ["Honeydew Melon", "Fresh Hay", "White Peony", "Sweet Almond"],
        "brewing_guide": {
            "temp": "75°C / 167°F",
            "steep_time": "4 mins",
            "ratio": "3.5g per 200ml",
            "infusions": 5
        },
        "image_url": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
        "is_featured": True,
        "display_order": 3,
        "is_available": True
    },
    {
        "name": "Moonlight Reserve Oolong",
        "slug": "moonlight-reserve-oolong",
        "category": "Oolong",
        "origin": "Mirik Valley, Darjeeling (6,000 ft)",
        "flush": "Late Autumn Harvest",
        "grade": "Artisanal Hand-Twisted",
        "short_description": "Semi-oxidized at 35%. Complex layers of toasted hazelnut, baked peach, and sweet osmanthus flower.",
        "description": "Crafted under the cool autumn moonlight in Mirik. Hand-tumbled in bamboo drums to gently bruise the leaf margins, allowing a 35% controlled oxidation. Dried over indirect aromatic pine embers, yielding a magnificent amber cup that shifts flavor across multiple successive infusions.",
        "flavor_notes": ["Baked Peach", "Toasted Hazelnut", "Osmanthus", "Creamy Vanilla"],
        "brewing_guide": {
            "temp": "90°C / 194°F",
            "steep_time": "3 mins",
            "ratio": "3g per 200ml",
            "infusions": 6
        },
        "image_url": "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?auto=format&fit=crop&w=900&q=80",
        "is_featured": False,
        "display_order": 4,
        "is_available": True
    },
    {
        "name": "Emerald Cloud Steamed Green",
        "slug": "emerald-cloud-steamed-green",
        "category": "Green Tea",
        "origin": "Temi Slopes, Sikkim (5,800 ft)",
        "flush": "Spring First Pick",
        "grade": "Whole Leaf Sencha Style",
        "short_description": "Bio-dynamic mountain green tea. Vibrant emerald liquor with sweet umami, steamed bamboo, and zero harsh bitterness.",
        "description": "Cultivated in pristine high-altitude bio-dynamic soil under the shadow of Mt. Kanchenjunga. Fresh leaves are quickly steamed within an hour of harvest to stop oxidation, preserving maximum polyphenols, amino acids, and vibrant chlorophyll color.",
        "flavor_notes": ["Steamed Bamboo", "Sweet Umami", "Young Spinaches", "Chestnut"],
        "brewing_guide": {
            "temp": "80°C / 176°F",
            "steep_time": "2 mins",
            "ratio": "2.5g per 200ml",
            "infusions": 3
        },
        "image_url": "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=900&q=80",
        "is_featured": False,
        "display_order": 5,
        "is_available": True
    },
    {
        "name": "Himalayan Herbal Rest Tisane",
        "slug": "himalayan-herbal-rest-tisane",
        "category": "Herbal / Tisane",
        "origin": "Kullu Valley, Himachal Pradesh (4,500 ft)",
        "flush": "Whole Blossom Harvest",
        "grade": "100% Caffeine-Free Whole Flowers",
        "short_description": "Soothing organic chamomile blossoms, high-altitude lavender buds, and wild Himalayan spearmint.",
        "description": "An exquisite naturally caffeine-free herbal infusion. Blended with sun-dried whole chamomile flowerheads, fragrant lavender, and cooling wild mountain mint. Designed as a calming restorative evening infusion.",
        "flavor_notes": ["Crisp Apple Blossom", "French Lavender", "Wild Spearmint", "Sweet Wood"],
        "brewing_guide": {
            "temp": "95°C / 203°F",
            "steep_time": "5 mins",
            "ratio": "3g per 250ml",
            "infusions": 2
        },
        "image_url": "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=80",
        "is_featured": False,
        "display_order": 6,
        "is_available": True
    }
]

def seed():
    init_db()
    with Session(engine) as session:
        # 1. Seed Admin User
        admin = session.exec(select(AdminUser).where(AdminUser.username == settings.ADMIN_USERNAME)).first()
        if not admin:
            admin = AdminUser(
                username=settings.ADMIN_USERNAME,
                hashed_password=hash_password(settings.ADMIN_INITIAL_PASSWORD)
            )
            session.add(admin)
            print(f"✓ Created default admin user: '{settings.ADMIN_USERNAME}'")
        else:
            print(f"• Admin user '{settings.ADMIN_USERNAME}' already exists")

        # 2. Seed About Site Content
        content = session.exec(select(SiteContent).where(SiteContent.key == "about")).first()
        if not content:
            content = SiteContent(
                key="about",
                title="Our Heritage & Terroir Philosophy",
                headline="From Mountain Mist to the Refined Cup",
                story=DEFAULT_ABOUT_STORY.strip(),
                values=DEFAULT_VALUES,
                contact_info=DEFAULT_CONTACT
            )
            session.add(content)
            print("✓ Created default About page story & company content")
        else:
            print("• About page content already exists")

        # 3. Seed Products
        for prod_data in INITIAL_PRODUCTS:
            existing = session.exec(select(Product).where(Product.slug == prod_data["slug"])).first()
            if not existing:
                product = Product(**prod_data)
                session.add(product)
                print(f"✓ Seeded product: {prod_data['name']} ({prod_data['category']})")
            else:
                print(f"• Product '{prod_data['name']}' already exists")

        session.commit()
    print("\n✓ Database seeding successfully finished!")

if __name__ == "__main__":
    seed()
