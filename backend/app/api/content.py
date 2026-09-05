from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import get_current_admin
from app.models.content import SiteContent, SiteContentUpdate

router = APIRouter(prefix="/content", tags=["Site Content"])

DEFAULT_ABOUT_STORY = """
### Born from Misty Hills and Ancient Soils

Nestled in the microclimates of the Eastern Himalayas and the Nilgiri highlands, Aura Artisanal Teas was founded on a singular principle: preserving the terroir, craft, and soul of authentic whole-leaf harvest.

For generations, commercial tea production has favored speed and mass processing. We deliberately took the opposite path. We partner exclusively with heritage bio-dynamic estates that adhere to single-lot plucking standards—hand-harvesting only the tender two leaves and a bud in the early dawn before the mountain mist evaporates.

### Sourcing & Ethics

Every leaf we export or showcase is directly traceable to its specific garden division and altitude. We work in direct partnership with small-holder tea farmers, paying above Fair-Trade premiums and supporting sustainable solar-assisted processing sheds. 

Our small-batch processing honors traditional orthodox rolling techniques, ensuring the whole cellular integrity of the leaf remains intact, yielding multiple infusions of unmatched floral sweetness, muscatel richness, and deep vegetal purity.
"""

DEFAULT_VALUES = {
    "pillars": [
        {
            "title": "Single-Estate Terroir",
            "description": "Never blended with commercial filler leaves. Every batch represents an authentic single harvest lot."
        },
        {
            "title": "Ethical Stewardship",
            "description": "100% fair grower compensation, bio-organic cultivation, and zero chemical pesticide runoff."
        },
        {
            "title": "Small-Batch Orthodox Craft",
            "description": "Slow solar-assisted withering, hand-rolling, and micro-lot roasting by generational tea masters."
        },
        {
            "title": "Direct B2B Procurement",
            "description": "Supplying bespoke tea programs to specialty cafes, luxury hospitality suites, and connoisseur importers worldwide."
        }
    ]
}

DEFAULT_CONTACT = {
    "estate_office": "Aura Tea Pavilion, Mountain Vista Road, Kurseong, Darjeeling 734203",
    "business_hours": "Monday – Saturday: 09:00 AM – 07:00 PM IST",
    "primary_email": "inquiries@aurateas.example.com",
    "exports_email": "exports@aurateas.example.com",
    "direct_phone": "+91-9876543210"
}

@router.get("/about", response_model=SiteContent)
def get_about_content(session: Session = Depends(get_session)):
    statement = select(SiteContent).where(SiteContent.key == "about")
    content = session.exec(statement).first()
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
        session.commit()
        session.refresh(content)
    return content

@router.put("/about", response_model=SiteContent)
def update_about_content(
    update_data: SiteContentUpdate,
    session: Session = Depends(get_session),
    _: dict = Depends(get_current_admin)
):
    statement = select(SiteContent).where(SiteContent.key == "about")
    content = session.exec(statement).first()
    if not content:
        content = SiteContent(key="about", story="")
        session.add(content)
    
    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(content, key, value)
        
    content.updated_at = datetime.now(timezone.utc)
    session.add(content)
    session.commit()
    session.refresh(content)
    return content
