import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles, ArrowRight, ArrowLeft, Check, ChevronDown, ChevronUp,
  IndianRupee, Clock, Wallet, Briefcase, RotateCcw, Bot, PenTool,
  Film, Camera, Hash, Pen, Banknote, Table, Code2, MessageCircle,
  GraduationCap, MoreHorizontal, MapPin,
} from "lucide-react";

/* ---------------------------------------------------------------- */
/*  Design tokens                                                    */
/* ---------------------------------------------------------------- */

const C = {
  bg: "#160F26",
  bgGlow: "#291B49",
  surface: "#221A38",
  surfaceAlt: "#2C2247",
  border: "rgba(247,244,236,0.12)",
  borderStrong: "rgba(247,244,236,0.22)",
  text: "#F7F4EC",
  textMuted: "#B4A8CE",
  textFaint: "#8578A3",
  amber: "#F2A73B",
  amberSoft: "rgba(242,167,59,0.16)",
  ink: "#1B1330",
  teal: "#3FBFA0",
  tealSoft: "rgba(63,191,160,0.15)",
  rose: "#E8637A",
  roseSoft: "rgba(232,99,122,0.15)",
};

const FONT_DISPLAY = "'Fraunces', serif";
const FONT_BODY = "'Sora', sans-serif";

function levelColor(level) {
  if (level === "Easy" || level === "Low") return { fg: C.teal, bg: C.tealSoft };
  if (level === "Medium") return { fg: C.amber, bg: C.amberSoft };
  return { fg: C.rose, bg: C.roseSoft };
}

/* ---------------------------------------------------------------- */
/*  Questionnaire data                                               */
/* ---------------------------------------------------------------- */

const NOT_SURE = "Doesn't matter";

const GOAL_OPTIONS = [
  { id: "5k", label: "\u20b95,000 / month", target: 5000 },
  { id: "10k", label: "\u20b910,000 / month", target: 10000 },
  { id: "25k", label: "\u20b925,000 / month", target: 25000 },
  { id: "50k", label: "\u20b950,000+ / month", target: 50000 },
  { id: "custom", label: "Custom amount", target: null },
];

const TIME_OPTIONS = [
  { id: "30min", label: "30 minutes a day", tier: 0, weekend: false },
  { id: "1hr", label: "1 hour a day", tier: 1, weekend: false },
  { id: "2hr", label: "2 hours a day", tier: 2, weekend: false },
  { id: "4hr", label: "4+ hours a day", tier: 3, weekend: false },
  { id: "weekend", label: "Weekends only", tier: 1, weekend: true },
];

const SKILL_OPTIONS = [
  { name: "Graphic design", icon: PenTool },
  { name: "Video editing", icon: Film },
  { name: "Photography", icon: Camera },
  { name: "Social media", icon: Hash },
  { name: "Sales", icon: Briefcase },
  { name: "Writing", icon: Pen },
  { name: "Finance", icon: Banknote },
  { name: "Excel", icon: Table },
  { name: "Coding", icon: Code2 },
  { name: "AI tools", icon: Bot },
  { name: "Communication", icon: MessageCircle },
  { name: "Teaching", icon: GraduationCap },
  { name: "Other", icon: MoreHorizontal },
];

const BUDGET_OPTIONS = [
  { id: "0", label: "\u20b90 to start", tier: 0 },
  { id: "u1k", label: "Under \u20b91,000", tier: 1 },
  { id: "1-5k", label: "\u20b91,000 \u2013 \u20b95,000", tier: 2 },
  { id: "5k+", label: "\u20b95,000+", tier: 3 },
];

const WORK_OPTIONS = [
  "Freelancing", "Selling products", "Local business services", "Content creation",
  "Reselling", "Online services", "AI-powered businesses", NOT_SURE,
];

const TOTAL_STEPS = 6;

/* ---------------------------------------------------------------- */
/*  Hustle database                                                  */
/* ---------------------------------------------------------------- */

const HUSTLES = [
  {
    id: "freelance-graphic-design", name: "Freelance Graphic Design", category: "Freelancing",
    explanation: "Design logos, social posts, and marketing graphics for small businesses and creators who don't have an in-house designer.",
    skills: ["Graphic design", "AI tools"], budgetTier: 0, timeTier: 1, weekendOk: true, location: "online",
    incomeMin: 4000, incomeMax: 30000, difficulty: "Medium", risk: "Low",
    startingCost: "\u20b90 \u2014 Canva's free plan is enough to start",
    timeToFirstIncome: "1\u20133 weeks",
    skillsRequired: "Basic layout sense, Canva or Figma, comfort taking client feedback",
    whereToFind: "Fiverr, Upwork, Instagram DMs to small shops, and college clubs or fests that need posters",
    firstActions: [
      "Design five sample pieces for a made-up client (menu, Instagram post, logo) as a portfolio",
      "Set up a Fiverr or Upwork gig with two clear packages and prices",
      "Message ten local shops or college societies offering a discounted first project",
    ],
    pricing: "\u20b9300\u2013800 per social post, \u20b91,500\u20134,000 per logo, \u20b9500\u20131,500 per poster",
    scalability: "Can grow into a small two-person studio, or turn your best work into templates sold on Etsy",
    aiTools: ["Canva Magic Studio", "Adobe Firefly", "ChatGPT for client briefs"],
  },
  {
    id: "freelance-video-editing", name: "Freelance Reels & Shorts Editing", category: "Freelancing",
    explanation: "Turn raw footage into polished Reels and Shorts for creators and small brands who film more than they can edit.",
    skills: ["Video editing", "AI tools"], budgetTier: 0, timeTier: 1, weekendOk: true, location: "online",
    incomeMin: 5000, incomeMax: 35000, difficulty: "Medium", risk: "Low",
    startingCost: "\u20b90 \u2014 CapCut is free and a phone is enough",
    timeToFirstIncome: "2\u20134 weeks",
    skillsRequired: "Comfort with CapCut or Premiere Rush, an eye for pacing and trends",
    whereToFind: "Instagram creators who need editors, Fiverr, local influencers, small business Reels",
    firstActions: [
      "Re-edit three existing public videos as portfolio samples",
      "Post your edits on Instagram tagged as a reel editor to attract inbound DMs",
      "Message ten micro-influencers offering one free trial edit",
    ],
    pricing: "\u20b9300\u2013600 per Reel, or \u20b92,000\u20136,000 for a monthly retainer of 8\u201310 videos",
    scalability: "Take on several creators as retainer clients, then hand off basic edits to a junior",
    aiTools: ["CapCut AI tools", "Descript", "ChatGPT for captions and hooks"],
  },
  {
    id: "freelance-writing", name: "Freelance Content Writing", category: "Freelancing",
    explanation: "Write blog posts, product descriptions, and social captions for businesses that need content but don't have a writer on staff.",
    skills: ["Writing", "AI tools"], budgetTier: 0, timeTier: 0, weekendOk: true, location: "online",
    incomeMin: 3000, incomeMax: 25000, difficulty: "Easy", risk: "Low",
    startingCost: "\u20b90",
    timeToFirstIncome: "1\u20132 weeks",
    skillsRequired: "Clean grammar, quick research, and the ability to match a brand's tone",
    whereToFind: "Fiverr, Upwork, LinkedIn outreach to startups, and small blogging agencies",
    firstActions: [
      "Write three sample articles in different niches for your portfolio",
      "Put your samples and rates on a simple Notion page or one-page site",
      "Pitch fifteen small businesses or newsletters directly over email",
    ],
    pricing: "\u20b91\u20133 per word for blog posts, \u20b9500\u20131,500 for a set of social captions",
    scalability: "Specialise in a higher-paying niche like finance or SaaS and raise your rates over time",
    aiTools: ["ChatGPT or Claude for drafts", "Grammarly", "Hemingway Editor"],
  },
  {
    id: "virtual-assistant", name: "Virtual Assistant Services", category: "Online services",
    explanation: "Handle inbox, scheduling, and day-to-day admin for busy founders and creators who need an extra pair of hands.",
    skills: ["Communication", "Excel"], budgetTier: 0, timeTier: 0, weekendOk: true, location: "online",
    incomeMin: 3000, incomeMax: 15000, difficulty: "Easy", risk: "Low",
    startingCost: "\u20b90",
    timeToFirstIncome: "1\u20132 weeks",
    skillsRequired: "Organisation, calendar and inbox management, basic spreadsheets",
    whereToFind: "Founder-focused Facebook groups, Upwork, referrals from other freelancers",
    firstActions: [
      "List the exact tasks you can take off someone's plate: inbox, scheduling, data entry",
      "Offer five small business owners or creators a free trial week",
      "Post in two or three founder groups offering ongoing support",
    ],
    pricing: "\u20b9150\u2013350 an hour, or \u20b96,000\u201315,000 a month for 10\u201315 hours a week",
    scalability: "Specialise in one type of task and raise your hourly rate as your track record builds",
    aiTools: ["Notion AI", "ChatGPT for email drafts", "Calendly"],
  },
  {
    id: "excel-bookkeeping", name: "Excel & Bookkeeping Support", category: "Freelancing",
    explanation: "Track income, expenses, and basic accounts for small shops and businesses that run their books on paper or not at all.",
    skills: ["Excel", "Finance"], budgetTier: 0, timeTier: 1, weekendOk: true, location: "both",
    incomeMin: 4000, incomeMax: 20000, difficulty: "Medium", risk: "Low",
    startingCost: "\u20b90 \u2014 Google Sheets is enough",
    timeToFirstIncome: "2\u20133 weeks",
    skillsRequired: "Comfort with formulas, basic bookkeeping concepts, attention to detail",
    whereToFind: "Local shop owners, neighbourhood business WhatsApp groups, Upwork",
    firstActions: [
      "Build a simple expense-tracker template to show as a work sample",
      "Offer three local shopkeepers a free first month of expense tracking",
      "List the service on Upwork or Fiverr as monthly bookkeeping for small shops",
    ],
    pricing: "\u20b91,500\u20135,000 a month per client, depending on transaction volume",
    scalability: "Take on 5\u201310 small clients on retainer, or move into tools like Zoho Books",
    aiTools: ["ChatGPT for formula help", "Google Sheets' built-in AI features"],
  },
  {
    id: "social-media-management", name: "Social Media Management for Local Businesses", category: "Local business services",
    explanation: "Plan, post, and grow Instagram and Facebook pages for local businesses that are too busy to do it themselves.",
    skills: ["Social media", "Communication"], budgetTier: 0, timeTier: 1, weekendOk: true, location: "local",
    incomeMin: 4000, incomeMax: 20000, difficulty: "Medium", risk: "Low",
    startingCost: "\u20b90",
    timeToFirstIncome: "2\u20134 weeks",
    skillsRequired: "A feel for Instagram and Facebook, basic content planning, light design",
    whereToFind: "Cafes, salons, gyms, and tuition centres near you \u2014 walk in or DM their page",
    firstActions: [
      "Audit one local business's Instagram and make three free sample posts",
      "Pitch a \u20b93,000\u20135,000 a month package: eight posts plus two stories a week",
      "Ask happy clients to refer you to other shop owners nearby",
    ],
    pricing: "\u20b93,000\u20138,000 a month per business for posting and light strategy",
    scalability: "Manage 5\u20138 local businesses at once, then hire a junior to handle posting",
    aiTools: ["Canva", "ChatGPT for captions", "Meta Business Suite scheduling"],
  },
  {
    id: "micro-web-dev", name: "Micro Web Development", category: "Freelancing",
    explanation: "Build simple, fast landing pages and small sites for local businesses that don't have a working website yet.",
    skills: ["Coding"], budgetTier: 0, timeTier: 2, weekendOk: true, location: "online",
    incomeMin: 5000, incomeMax: 40000, difficulty: "Hard", risk: "Low",
    startingCost: "\u20b90 \u2014 free hosting tiers like Vercel or Netlify",
    timeToFirstIncome: "2\u20134 weeks",
    skillsRequired: "HTML, CSS and JS (or a no-code builder), basic client communication",
    whereToFind: "Upwork, local businesses without a working website, college societies",
    firstActions: [
      "Build two demo landing pages, like a cafe or a tutor's site, for your portfolio",
      "Find five local businesses with no site or a broken one and pitch a fix",
      "List a simple three-day landing page package as a fixed-price Fiverr gig",
    ],
    pricing: "\u20b93,000\u201310,000 for a single-page site, \u20b910,000\u201330,000 for a small multi-page site",
    scalability: "Move into small online stores, or monthly website maintenance retainers",
    aiTools: ["Claude or ChatGPT for code", "GitHub Copilot", "AI site builders like v0"],
  },
  {
    id: "handmade-crafts", name: "Handmade or Craft Products on Instagram", category: "Selling products",
    explanation: "Make and sell a handmade product \u2014 jewellery, candles, art, baked goods \u2014 directly to customers on Instagram.",
    skills: ["Photography", "Social media"], budgetTier: 1, timeTier: 1, weekendOk: true, location: "both",
    incomeMin: 2000, incomeMax: 15000, difficulty: "Medium", risk: "Medium",
    startingCost: "Under \u20b91,000 for basic materials",
    timeToFirstIncome: "2\u20136 weeks",
    skillsRequired: "A craft you're good at (jewellery, candles, art, baking), basic product photos",
    whereToFind: "Instagram Shop, college fests and flea markets, WhatsApp status",
    firstActions: [
      "Make ten units of one product you're confident about",
      "Shoot clean photos in natural light and set up an Instagram Shop",
      "Sell your first batch to friends and classmates and ask them to share your story",
    ],
    pricing: "Price at 2.5 to 3 times your material and packaging cost",
    scalability: "Add a second product line, sell wholesale to local stores, or list on Meesho or Etsy",
    aiTools: ["Canva for product mockups", "ChatGPT for product descriptions"],
  },
  {
    id: "print-on-demand", name: "Print-on-Demand Merchandise", category: "Selling products",
    explanation: "Design niche t-shirts, stickers, and merch that only get printed and shipped after someone buys.",
    skills: ["Graphic design"], budgetTier: 0, timeTier: 0, weekendOk: true, location: "online",
    incomeMin: 1500, incomeMax: 12000, difficulty: "Easy", risk: "Medium",
    startingCost: "\u20b90 \u2014 most platforms only print after a sale",
    timeToFirstIncome: "3\u20136 weeks",
    skillsRequired: "A design style or niche idea, basic Canva or Photoshop",
    whereToFind: "Instagram, a niche subreddit or Discord community, college fandoms",
    firstActions: [
      "Pick one niche, like a local sports team, a meme trend, or a college in-joke",
      "Design 5\u20138 t-shirt or sticker designs and list them on a print-on-demand platform",
      "Post your designs in relevant niche communities and your own Instagram",
    ],
    pricing: "\u20b9150\u2013400 margin per t-shirt after print cost",
    scalability: "Expand into more niches, or build a small branded merch store",
    aiTools: ["Midjourney or Canva for concepts", "ChatGPT for niche research"],
  },
  {
    id: "digital-products", name: "Digital Products: Templates & Ebooks", category: "Selling products",
    explanation: "Package what you already know into a template, guide, or ebook that people can buy and download instantly.",
    skills: ["Writing", "AI tools"], budgetTier: 0, timeTier: 1, weekendOk: true, location: "online",
    incomeMin: 1000, incomeMax: 20000, difficulty: "Medium", risk: "Medium",
    startingCost: "\u20b90",
    timeToFirstIncome: "3\u20136 weeks",
    skillsRequired: "Real knowledge in one area, like study notes, budgeting, or productivity, plus basic design",
    whereToFind: "Instagram, Gumroad, a niche subreddit, college WhatsApp groups",
    firstActions: [
      "Package something you're already good at into a template or short guide",
      "List it on Gumroad or Instagram with a clear before-and-after promise",
      "Share it in three communities where your target buyer actually hangs out",
    ],
    pricing: "\u20b999\u2013499 per digital product",
    scalability: "Bundle products, build a small email list, and launch new products to the same buyers",
    aiTools: ["ChatGPT or Claude to draft content", "Notion", "Canva for layout"],
  },
  {
    id: "home-tutoring", name: "Home Tutoring", category: "Local business services",
    explanation: "Teach a school or college subject you're strong in, one-on-one or in small groups, in your own neighbourhood.",
    skills: ["Teaching", "Communication"], budgetTier: 0, timeTier: 1, weekendOk: true, location: "local",
    incomeMin: 3000, incomeMax: 20000, difficulty: "Easy", risk: "Low",
    startingCost: "\u20b90",
    timeToFirstIncome: "1\u20132 weeks",
    skillsRequired: "A strong grasp of a school or college subject, patience, basic lesson planning",
    whereToFind: "Neighbourhood WhatsApp groups, notice boards, relatives' kids, tutoring apps",
    firstActions: [
      "Pick one or two subjects you can confidently teach at a school level",
      "Tell ten neighbours or relatives you're tutoring and ask them to spread the word",
      "Offer one free trial class to turn interest into paying students",
    ],
    pricing: "\u20b9300\u2013800 an hour one-on-one, \u20b9150\u2013400 an hour per student in small groups",
    scalability: "Run small group batches instead of one-on-one, or move online to teach beyond your city",
    aiTools: ["ChatGPT to build practice worksheets", "Canva for simple notes"],
  },
  {
    id: "event-photography", name: "Event & Portrait Photography", category: "Local business services",
    explanation: "Shoot birthdays, college fests, and small business product photos using a phone or a basic camera.",
    skills: ["Photography"], budgetTier: 2, timeTier: 1, weekendOk: true, location: "local",
    incomeMin: 3000, incomeMax: 25000, difficulty: "Medium", risk: "Medium",
    startingCost: "\u20b91,000\u20135,000 if renting gear, \u20b90 if you already own a decent phone or camera",
    timeToFirstIncome: "2\u20134 weeks",
    skillsRequired: "An eye for composition, basic editing in Lightroom or Snapseed",
    whereToFind: "College fests, birthday parties, small business product shoots, Instagram",
    firstActions: [
      "Shoot two or three free sessions, like friends or a local shop's products",
      "Create an Instagram page with your best twelve shots",
      "Offer a discounted rate to your first five paying clients in exchange for reviews",
    ],
    pricing: "\u20b91,500\u20134,000 for a short shoot, \u20b95,000\u201315,000 for a full event",
    scalability: "Add videography, or build a small team to cover multiple events a weekend",
    aiTools: ["Lightroom AI presets", "Canva for a portfolio page", "ChatGPT for client messages"],
  },
  {
    id: "local-errands", name: "Campus & Local Task Services", category: "Local business services",
    explanation: "Run errands, deliveries, and small tasks for busy neighbours, hostel mates, or elderly residents nearby.",
    skills: ["Communication", "Other"], budgetTier: 0, timeTier: 0, weekendOk: true, location: "local",
    incomeMin: 1500, incomeMax: 8000, difficulty: "Easy", risk: "Low",
    startingCost: "\u20b90",
    timeToFirstIncome: "Under a week",
    skillsRequired: "Reliability \u2014 a bicycle or scooter helps but isn't required",
    whereToFind: "College WhatsApp groups, hostel notice boards, elderly neighbours, local groups",
    firstActions: [
      "Decide on two or three specific tasks you'll offer, like errands or print pickups",
      "Post in your hostel and neighbourhood groups with a simple price list",
      "Do your first three jobs reliably and ask for word-of-mouth referrals",
    ],
    pricing: "\u20b950\u2013150 per task depending on distance and effort",
    scalability: "Bundle recurring clients, like weekly grocery runs, into a small subscription",
    aiTools: ["WhatsApp Business for organising requests"],
  },
  {
    id: "local-telecalling", name: "Telecalling & Sales for Local Businesses", category: "Local business services",
    explanation: "Call leads and follow up on behalf of local businesses that don't have time to chase every enquiry.",
    skills: ["Sales", "Communication"], budgetTier: 0, timeTier: 1, weekendOk: true, location: "local",
    incomeMin: 3000, incomeMax: 15000, difficulty: "Medium", risk: "Low",
    startingCost: "\u20b90",
    timeToFirstIncome: "1\u20132 weeks",
    skillsRequired: "Comfort on the phone, handling rejection, basic persuasion",
    whereToFind: "Local real estate agents, coaching centres, and shops that rely on lead follow-up",
    firstActions: [
      "List five local businesses that clearly rely on calls or leads",
      "Pitch a simple deal: a small base fee plus commission per converted lead",
      "Track your calls in a spreadsheet to prove results and negotiate better rates",
    ],
    pricing: "\u20b95,000\u201310,000 a month base plus 5\u201310% commission, or pure commission",
    scalability: "Take on multiple businesses, or move from calling into closing sales",
    aiTools: ["ChatGPT for call scripts", "Google Sheets for lead tracking"],
  },
  {
    id: "niche-content-channel", name: "Niche YouTube or Instagram Channel", category: "Content creation",
    explanation: "Build a focused YouTube or Instagram channel around one specific topic and earn through views and brand deals.",
    skills: ["Video editing", "Social media", "Photography"], budgetTier: 0, timeTier: 2, weekendOk: true, location: "online",
    incomeMin: 0, incomeMax: 30000, difficulty: "Hard", risk: "High",
    startingCost: "\u20b90 \u2014 a phone is enough to start",
    timeToFirstIncome: "2\u20136 months",
    skillsRequired: "Consistency, a specific niche and point of view, basic filming and editing",
    whereToFind: "Money comes from brand deals and platform payouts, not direct pitching",
    firstActions: [
      "Pick one specific niche and audience, not something broad like lifestyle",
      "Post ten pieces of content before judging results, and study what performs",
      "Once you hit 5,000\u201310,000 followers, start reaching out to small brands",
    ],
    pricing: "\u20b93,000\u201315,000 per brand collaboration once you have an engaged niche audience",
    scalability: "The highest ceiling on this list, but also the slowest and least predictable to build",
    aiTools: ["CapCut or Descript for editing", "ChatGPT for scripting and hooks", "Analytics tools like TubeBuddy"],
  },
  {
    id: "faceless-ai-content", name: "Faceless AI-Generated Content Channel", category: "Content creation",
    explanation: "Use AI voiceovers and visuals to produce short-form videos without ever appearing on camera yourself.",
    skills: ["AI tools", "Video editing"], budgetTier: 1, timeTier: 1, weekendOk: true, location: "online",
    incomeMin: 0, incomeMax: 20000, difficulty: "Medium", risk: "High",
    startingCost: "Under \u20b91,000 a month for AI tool subscriptions",
    timeToFirstIncome: "1\u20133 months",
    skillsRequired: "Prompting AI tools well, basic video assembly, a clear content angle",
    whereToFind: "Money comes from ad payouts and affiliate links, not client outreach",
    firstActions: [
      "Pick a faceless format: facts, stories, top-ten lists, or AI voiceover explainers",
      "Produce 15\u201320 short videos using AI voice and stock or AI visuals to find your rhythm",
      "Add affiliate links or a small digital product once you have steady views",
    ],
    pricing: "Ad payouts vary widely; affiliate commissions typically run 5\u201320%",
    scalability: "Run several channels in different niches once you have a repeatable process",
    aiTools: ["ElevenLabs for voiceover", "CapCut", "ChatGPT or Claude for scripts", "AI video tools like Pictory"],
  },
  {
    id: "local-video-testimonials", name: "Video Testimonials for Local Businesses", category: "Content creation",
    explanation: "Film short, authentic customer testimonial videos that local businesses can use to build trust online.",
    skills: ["Video editing", "Communication"], budgetTier: 0, timeTier: 1, weekendOk: true, location: "local",
    incomeMin: 3000, incomeMax: 15000, difficulty: "Medium", risk: "Low",
    startingCost: "\u20b90",
    timeToFirstIncome: "2\u20133 weeks",
    skillsRequired: "Basic filming and editing, comfort approaching business owners",
    whereToFind: "Restaurants, salons, gyms, and clinics that want more social proof",
    firstActions: [
      "Offer one local business a free testimonial-style video of a happy customer",
      "Use that video as proof to pitch a package of four videos a month",
      "Ask for a Google review and referral once the business sees results",
    ],
    pricing: "\u20b92,000\u20136,000 a month per business for 2\u20134 short videos",
    scalability: "Pair this with social media management for a bigger monthly retainer",
    aiTools: ["CapCut", "ChatGPT for captions and outreach messages"],
  },
  {
    id: "reselling-wholesale", name: "Instagram & WhatsApp Reselling", category: "Reselling",
    explanation: "Source products from wholesale apps and resell them to your own network through WhatsApp and Instagram.",
    skills: ["Sales", "Social media"], budgetTier: 1, timeTier: 0, weekendOk: true, location: "both",
    incomeMin: 2000, incomeMax: 15000, difficulty: "Easy", risk: "Medium",
    startingCost: "Under \u20b91,000 \u2014 many apps let you sell before you buy stock",
    timeToFirstIncome: "1\u20132 weeks",
    skillsRequired: "Basic sales chat skills, consistency posting to WhatsApp status and Instagram",
    whereToFind: "Your own WhatsApp contacts, Instagram, college and hostel groups",
    firstActions: [
      "Sign up on a reselling app and pick 10\u201315 products in one category",
      "Post product photos to your WhatsApp status and Instagram daily",
      "Follow up personally with anyone who reacts or asks the price",
    ],
    pricing: "Typical margin of \u20b950\u2013300 per item depending on category",
    scalability: "Narrow into one profitable category and build repeat customers over time",
    aiTools: ["Canva for product posts", "ChatGPT for sales messages"],
  },
  {
    id: "thrift-flipping", name: "Thrift Flipping: Secondhand Fashion Resale", category: "Reselling",
    explanation: "Buy secondhand clothing in bulk, style and photograph the best pieces, and resell them individually online.",
    skills: ["Sales", "Photography"], budgetTier: 2, timeTier: 1, weekendOk: true, location: "both",
    incomeMin: 2000, incomeMax: 18000, difficulty: "Medium", risk: "Medium",
    startingCost: "\u20b91,000\u20135,000 to buy initial stock",
    timeToFirstIncome: "2\u20134 weeks",
    skillsRequired: "An eye for good pieces, basic styling, product photography",
    whereToFind: "Local thrift markets or bulk lots, resold via Instagram or resale apps",
    firstActions: [
      "Buy a small lot of 15\u201320 pieces from a local thrift or wholesale market",
      "Clean, style, and photograph each piece against a simple background",
      "List on Instagram with prices and post regularly to build a following",
    ],
    pricing: "Mark up 2 to 4 times your purchase cost per piece",
    scalability: "Build a recognisable aesthetic and a loyal repeat-buyer audience",
    aiTools: ["Canva for a consistent Instagram grid", "ChatGPT for product captions"],
  },
  {
    id: "online-micro-tutoring", name: "Online Tutoring & Exam Prep", category: "Online services",
    explanation: "Teach students beyond your own city over video call, on your own schedule, through tutoring platforms.",
    skills: ["Teaching", "Coding"], budgetTier: 0, timeTier: 1, weekendOk: true, location: "online",
    incomeMin: 3000, incomeMax: 25000, difficulty: "Medium", risk: "Low",
    startingCost: "\u20b90",
    timeToFirstIncome: "1\u20133 weeks",
    skillsRequired: "Strong subject knowledge, the ability to explain clearly over a video call",
    whereToFind: "Tutoring platforms, Instagram or LinkedIn posts, student groups outside your city",
    firstActions: [
      "Pick a subject or exam you can teach confidently",
      "Sign up on one or two tutoring platforms and set a competitive intro rate",
      "Offer a free 20-minute trial session to your first five leads",
    ],
    pricing: "\u20b9300\u20131,000 an hour depending on subject and track record",
    scalability: "Move from one-on-one to small group cohorts to multiply your hourly earnings",
    aiTools: ["ChatGPT to build practice questions", "Notion for lesson planning"],
  },
  {
    id: "fiverr-micro-gigs", name: "Data Entry & Admin Micro-Gigs", category: "Online services",
    explanation: "Pick up small, well-defined data entry and admin tasks that businesses post on freelance platforms.",
    skills: ["Excel", "Communication"], budgetTier: 0, timeTier: 0, weekendOk: true, location: "online",
    incomeMin: 1500, incomeMax: 10000, difficulty: "Easy", risk: "Low",
    startingCost: "\u20b90",
    timeToFirstIncome: "1\u20132 weeks",
    skillsRequired: "Basic spreadsheet skills, attention to detail, meeting deadlines",
    whereToFind: "Fiverr, Upwork, freelance Facebook groups",
    firstActions: [
      "Set up Fiverr and Upwork profiles with a clear, specific gig title",
      "Apply to ten small data-entry or admin-support jobs in your first week",
      "Deliver your first jobs early to build five-star reviews quickly",
    ],
    pricing: "\u20b9300\u2013800 per small task, \u20b980\u2013200 an hour for ongoing admin work",
    scalability: "Specialise, like catalog entry for e-commerce, and raise your rate with reviews",
    aiTools: ["ChatGPT for email templates", "Google Sheets formulas and AI features"],
  },
  {
    id: "ai-content-agency", name: "AI-Powered Social Media Agency", category: "AI-powered businesses",
    explanation: "Use AI tools to produce a full month of social content fast, so you can serve more local clients than a traditional agency could.",
    skills: ["AI tools", "Social media", "Sales"], budgetTier: 1, timeTier: 2, weekendOk: true, location: "both",
    incomeMin: 5000, incomeMax: 40000, difficulty: "Hard", risk: "Medium",
    startingCost: "Under \u20b91,000 a month for AI tool subscriptions",
    timeToFirstIncome: "3\u20136 weeks",
    skillsRequired: "Comfort chaining AI tools together, basic sales pitching, a social media sense",
    whereToFind: "Local businesses, direct outreach, referrals from your first few clients",
    firstActions: [
      "Build a repeatable AI-assisted workflow for captions, graphics, and hashtags",
      "Pitch two local businesses a done-for-you package built on this faster process",
      "Use the time AI saves you to take on 3\u20135 clients instead of one",
    ],
    pricing: "\u20b94,000\u201312,000 a month per client, undercutting slower traditional agencies on speed",
    scalability: "One person can serve far more clients than manual work allows \u2014 strong efficiency scaling",
    aiTools: ["ChatGPT or Claude for captions and strategy", "Canva Magic Studio", "Buffer or Meta Business Suite"],
  },
  {
    id: "ai-automation-smb", name: "AI Automation & Chatbots for Small Businesses", category: "AI-powered businesses",
    explanation: "Build simple chatbots and automations that handle repetitive customer questions for small businesses.",
    skills: ["AI tools", "Coding"], budgetTier: 1, timeTier: 2, weekendOk: true, location: "online",
    incomeMin: 5000, incomeMax: 40000, difficulty: "Hard", risk: "Medium",
    startingCost: "Under \u20b91,000 a month for tool subscriptions",
    timeToFirstIncome: "3\u20138 weeks",
    skillsRequired: "Comfort with no-code tools like Zapier, or light coding, plus problem-solving with owners",
    whereToFind: "Small e-commerce sellers, clinics, and coaching businesses drowning in repeat questions",
    firstActions: [
      "Build one working demo, like a WhatsApp FAQ bot for a fictional shop",
      "Find five local businesses that field repetitive questions and pitch the demo",
      "Charge a small setup fee plus a low monthly maintenance fee",
    ],
    pricing: "\u20b95,000\u201315,000 one-time setup, plus \u20b91,000\u20133,000 a month maintenance",
    scalability: "Turn your first build into a template you can resell with small tweaks",
    aiTools: ["Claude or ChatGPT for logic", "Zapier or Make.com", "WhatsApp Business API tools"],
  },
  {
    id: "ai-resume-linkedin", name: "AI-Assisted Resume & LinkedIn Optimisation", category: "AI-powered businesses",
    explanation: "Rewrite resumes and LinkedIn profiles using AI as a drafting tool, polished with your own editing and judgement.",
    skills: ["Writing", "AI tools", "Communication"], budgetTier: 0, timeTier: 0, weekendOk: true, location: "online",
    incomeMin: 2000, incomeMax: 15000, difficulty: "Easy", risk: "Low",
    startingCost: "\u20b90",
    timeToFirstIncome: "1\u20132 weeks",
    skillsRequired: "Good writing sense, an understanding of what recruiters look for, AI prompting",
    whereToFind: "College placement groups, LinkedIn, juniors preparing for internships",
    firstActions: [
      "Rewrite two or three friends' resumes for free to build before-and-after samples",
      "Post your samples on LinkedIn and in college placement groups",
      "Offer a simple three-tier package: resume only, resume plus LinkedIn, or the full package",
    ],
    pricing: "\u20b9300\u2013800 for a resume, \u20b9800\u20132,000 for a full profile overhaul",
    scalability: "Expand into interview prep or a placement-season deal with your college",
    aiTools: ["ChatGPT or Claude for drafting", "Canva for resume templates"],
  },
];

/* ---------------------------------------------------------------- */
/*  Recommendation engine                                            */
/* ---------------------------------------------------------------- */

function inr(n) {
  return "\u20b9" + Math.round(n).toLocaleString("en-IN");
}

function computeRecommendations(answers) {
  const goalTarget = answers.goalTier === "custom"
    ? Number(answers.goalCustom) || 0
    : GOAL_OPTIONS.find((g) => g.id === answers.goalTier)?.target || 0;
  const timeOpt = TIME_OPTIONS.find((t) => t.id === answers.time);
  const budgetOpt = BUDGET_OPTIONS.find((b) => b.id === answers.budget);
  if (!timeOpt || !budgetOpt) return [];

  function passes(h, relaxBudget, relaxLocation) {
    if (!relaxBudget && h.budgetTier > budgetOpt.tier) return false;
    if (!relaxLocation && answers.mode === "online" && h.location === "local") return false;
    return true;
  }

  function score(h) {
    let s = 0;
    const matched = h.skills.filter((sk) => answers.skills.includes(sk));
    s += matched.length * 25;
    if (answers.preferredWork === NOT_SURE || h.category === answers.preferredWork) s += 20;
    if (timeOpt.weekend) {
      if (h.weekendOk) s += 15;
    } else if (h.timeTier <= timeOpt.tier) {
      s += 15;
    } else {
      s -= 12;
    }
    if (h.budgetTier <= budgetOpt.tier) s += 8;
    if (goalTarget) {
      if (goalTarget <= h.incomeMax) s += 18;
      if (goalTarget >= h.incomeMin) s += 6;
    }
    if (h.location === "both") s += 4;
    return s;
  }

  let pool = HUSTLES.filter((h) => passes(h, false, false));
  if (pool.length < 3) pool = HUSTLES.filter((h) => passes(h, true, false));
  if (pool.length < 3) pool = HUSTLES.slice();

  const scored = pool.map((h) => ({ ...h, _score: score(h) }));
  scored.sort((a, b) => b._score - a._score);
  const top = scored.slice(0, 4);
  const maxScore = Math.max(...top.map((h) => h._score), 1);

  return top.map((h) => ({
    ...h,
    matchPercent: Math.max(58, Math.min(96, Math.round((h._score / (maxScore * 1.12)) * 100))),
  }));
}

function buildWhyMatch(h, answers, timeLabel, budgetLabel) {
  const matched = h.skills.filter((sk) => answers.skills.includes(sk));
  const bits = [];
  if (matched.length) {
    bits.push(`You already picked ${matched.join(" and ")} as a skill, and this hustle uses it directly.`);
  } else {
    bits.push(`This needs very little specialised skill, so it's realistic to start even without ${h.skills[0].toLowerCase()} experience yet.`);
  }
  bits.push(`It's built to fit around ${timeLabel.toLowerCase()}.`);
  if (h.budgetTier === 0) {
    bits.push("You can start it with zero budget, which matches what you told us.");
  } else {
    bits.push(`It fits inside your starting budget of ${budgetLabel.toLowerCase()}.`);
  }
  if (answers.preferredWork !== NOT_SURE && h.category === answers.preferredWork) {
    bits.push(`It's also the kind of work you said you prefer: ${h.category.toLowerCase()}.`);
  }
  return bits.join(" ");
}

/* ---------------------------------------------------------------- */
/*  Small UI building blocks                                         */
/* ---------------------------------------------------------------- */

function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Sora:wght@400;500;600;700&display=swap');
      .shai * { box-sizing: border-box; }
      .shai { -webkit-tap-highlight-color: transparent; }
      .shai button { font-family: inherit; }
      .shai-scroll::-webkit-scrollbar { display: none; }
      .shai-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      @keyframes shaiMarquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      .shai-marquee { animation: shaiMarquee 26s linear infinite; }
      @keyframes shaiFillRing {
        to { stroke-dashoffset: 6; }
      }
      .shai-ring { stroke-dashoffset: 100; animation: shaiFillRing 1.5s ease-out forwards; }
      @keyframes shaiFadeUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .shai-step { animation: shaiFadeUp 0.32s ease-out; }
      .shai-notch {
        position: absolute; width: 18px; height: 18px; border-radius: 9999px;
        background: ${C.bg}; top: 50%; transform: translateY(-50%);
      }
      .shai input[type="number"]::-webkit-outer-spin-button,
      .shai input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      .shai input[type="number"] { -moz-appearance: textfield; }
    `}</style>
  );
}

function TopBrand({ small }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: small ? 26 : 34, height: small ? 26 : 34, background: C.amberSoft }}
      >
        <Sparkles size={small ? 14 : 18} color={C.amber} />
      </div>
      <span style={{ fontFamily: FONT_DISPLAY, color: C.text, fontSize: small ? 16 : 19, fontWeight: 600 }}>
        SideHustle AI
      </span>
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, icon: Icon = ArrowRight }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2 rounded-2xl w-full py-4 font-semibold transition-transform active:scale-95"
      style={{
        background: disabled ? C.surfaceAlt : C.amber,
        color: disabled ? C.textFaint : C.ink,
        fontSize: 15,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
      <Icon size={18} />
    </button>
  );
}

function OptionRow({ label, selected, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition-transform active:scale-95"
      style={{
        background: selected ? C.amberSoft : C.surface,
        border: `1px solid ${selected ? C.amber : C.border}`,
      }}
    >
      {Icon && (
        <div
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: 34, height: 34, background: selected ? "rgba(242,167,59,0.25)" : C.surfaceAlt }}
        >
          <Icon size={16} color={selected ? C.amber : C.textMuted} />
        </div>
      )}
      <span className="flex-1" style={{ color: C.text, fontSize: 15, fontWeight: 500 }}>{label}</span>
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{
          width: 22, height: 22,
          border: `2px solid ${selected ? C.amber : C.borderStrong}`,
          background: selected ? C.amber : "transparent",
        }}
      >
        {selected && <Check size={13} color={C.ink} strokeWidth={3} />}
      </div>
    </button>
  );
}

function SkillChip({ name, Icon, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-full px-3.5 py-2.5 transition-transform active:scale-95"
      style={{
        background: selected ? C.amber : C.surface,
        border: `1px solid ${selected ? C.amber : C.border}`,
      }}
    >
      <Icon size={14} color={selected ? C.ink : C.textMuted} />
      <span style={{ color: selected ? C.ink : C.text, fontSize: 13.5, fontWeight: 600 }}>{name}</span>
    </button>
  );
}

function ProgressBar({ stepIndex }) {
  const pct = (stepIndex / TOTAL_STEPS) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: C.surfaceAlt }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: C.amber, transitionDuration: "350ms" }}
        />
      </div>
      <span style={{ color: C.textFaint, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>
        {stepIndex + 1} / {TOTAL_STEPS}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Recommendation card                                              */
/* ---------------------------------------------------------------- */

function StatBlock({ label, value }) {
  return (
    <div className="rounded-xl px-3 py-2.5" style={{ background: C.surfaceAlt }}>
      <div style={{ color: C.textFaint, fontSize: 11, marginBottom: 3 }}>{label}</div>
      <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function Pill({ label, level }) {
  const c = levelColor(level);
  return (
    <span
      className="rounded-full px-2.5 py-1"
      style={{ background: c.bg, color: c.fg, fontSize: 11.5, fontWeight: 700 }}
    >
      {label}
    </span>
  );
}

function HustleCard({ h, index, answers, timeLabel, budgetLabel, expanded, onToggle }) {
  const whyMatch = useMemo(() => buildWhyMatch(h, answers, timeLabel, budgetLabel), [h, answers, timeLabel, budgetLabel]);

  return (
    <div className="rounded-3xl overflow-visible relative" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 style={{ fontFamily: FONT_DISPLAY, color: C.text, fontSize: 19, fontWeight: 600, lineHeight: 1.25 }}>
            {h.name}
          </h3>
          {index === 0 ? (
            <span className="rounded-full px-2.5 py-1 shrink-0" style={{ background: C.amber, color: C.ink, fontSize: 10.5, fontWeight: 700 }}>
              Best match
            </span>
          ) : (
            <span className="shrink-0" style={{ color: C.amber, fontSize: 12.5, fontWeight: 700 }}>
              {h.matchPercent}% match
            </span>
          )}
        </div>
        <div className="mb-3" style={{ color: C.textFaint, fontSize: 12.5 }}>{h.category}</div>

        <div className="flex gap-2 mb-3.5">
          <Pill label={`${h.difficulty} to start`} level={h.difficulty} />
          <Pill label={`${h.risk} risk`} level={h.risk} />
        </div>

        <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.55 }}>{h.explanation}</p>
      </div>

      <div className="px-5 grid grid-cols-2 gap-2 mb-4">
        <StatBlock label="Starting cost" value={h.startingCost} />
        <StatBlock label="Time to first income" value={h.timeToFirstIncome} />
      </div>
      <div className="px-5 mb-2">
        <div className="rounded-xl px-3 py-2.5" style={{ background: C.surfaceAlt }}>
          <div style={{ color: C.textFaint, fontSize: 11, marginBottom: 3 }}>Realistic monthly income</div>
          <div style={{ color: C.text, fontSize: 14, fontWeight: 700 }}>
            {inr(h.incomeMin)} \u2013 {inr(h.incomeMax)}
          </div>
          <div style={{ color: C.textFaint, fontSize: 10.5, marginTop: 2 }}>
            Approximate. Depends on your effort, demand, and local market.
          </div>
        </div>
      </div>

      <div className="relative px-5 py-2">
        <div style={{ borderTop: `2px dashed ${C.border}` }} />
        <div className="shai-notch" style={{ left: -9 }} />
        <div className="shai-notch" style={{ right: -9 }} />
      </div>

      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-1.5 px-5 py-3.5 transition-transform active:scale-95"
      >
        <span style={{ color: C.amber, fontSize: 13.5, fontWeight: 700 }}>
          {expanded ? "Hide full plan" : "View full plan"}
        </span>
        {expanded ? <ChevronUp size={16} color={C.amber} /> : <ChevronDown size={16} color={C.amber} />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 shai-step" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ color: C.amber, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Why this fits you</div>
            <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.6 }}>{whyMatch}</p>
          </div>

          <div>
            <div style={{ color: C.amber, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Skills you'll use</div>
            <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.6 }}>{h.skillsRequired}</p>
          </div>

          <div>
            <div style={{ color: C.amber, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Where to find customers</div>
            <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.6 }}>{h.whereToFind}</p>
          </div>

          <div>
            <div style={{ color: C.amber, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Your first three moves</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {h.firstActions.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="flex items-center justify-center rounded-full shrink-0"
                    style={{ width: 20, height: 20, background: C.amberSoft, marginTop: 1 }}
                  >
                    <span style={{ color: C.amber, fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                  </div>
                  <span style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.55 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ color: C.amber, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Suggested pricing</div>
            <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.6 }}>{h.pricing}</p>
          </div>

          <div>
            <div style={{ color: C.amber, fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Room to grow</div>
            <p style={{ color: C.textMuted, fontSize: 13.5, lineHeight: 1.6 }}>{h.scalability}</p>
          </div>

          <div>
            <div style={{ color: C.amber, fontSize: 12, fontWeight: 700, marginBottom: 7 }}>AI tools that can help</div>
            <div className="flex flex-wrap gap-1.5">
              {h.aiTools.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-2.5 py-1.5"
                  style={{ background: C.surfaceAlt, color: C.textMuted, fontSize: 12 }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Landing screen                                                   */
/* ---------------------------------------------------------------- */

const TICKER_ITEMS = [
  "Freelance design work pays around \u20b98,000 a month",
  "Reselling on Instagram brings in about \u20b96,000 a month",
  "Weekend tutoring adds roughly \u20b95,000 a month",
  "Editing Reels for creators earns near \u20b910,000 a month",
  "Managing socials for local shops nets about \u20b97,000 a month",
];

function LandingScreen({ onStart }) {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="flex flex-col shai-step" style={{ minHeight: "100%" }}>
      <div className="px-5 pt-8 pb-2">
        <TopBrand />
      </div>

      <div className="px-5 pt-10 pb-6">
        <h1 style={{ fontFamily: FONT_DISPLAY, color: C.text, fontSize: 34, fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.5 }}>
          Find a side hustle that actually pays
        </h1>
        <p className="mt-4" style={{ color: C.textMuted, fontSize: 15.5, lineHeight: 1.6 }}>
          Answer six quick questions about your skills, time, and budget.
          Get realistic, India-ready ways to earn on the side \u2014 matched to you, not generic advice.
        </p>
      </div>

      <div className="py-3 mb-6 overflow-hidden shai-scroll" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex gap-3 shai-marquee" style={{ width: "max-content" }}>
          {loop.map((item, i) => (
            <span
              key={i}
              className="rounded-full px-3.5 py-2 whitespace-nowrap shrink-0"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.textMuted, fontSize: 12.5 }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 mt-auto pb-8">
        <PrimaryButton onClick={onStart}>Start the 2-minute quiz</PrimaryButton>
        <p className="mt-3 text-center" style={{ color: C.textFaint, fontSize: 12 }}>
          No guarantees, no hype \u2014 just realistic options matched to you.
        </p>
        <p className="mt-5 text-center" style={{ color: C.textFaint, fontSize: 11.5 }}>
          24 vetted hustle paths across freelancing, reselling, content, and more
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Loading screen                                                   */
/* ---------------------------------------------------------------- */

const LOADING_MESSAGES = [
  "Reading your skills\u2026",
  "Checking your starting budget\u2026",
  "Matching your available time\u2026",
  "Ranking realistic options\u2026",
];

function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length), 400);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center shai-step" style={{ minHeight: "100%" }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r="38" fill="none" stroke={C.surfaceAlt} strokeWidth="6" />
        <circle
          cx="44" cy="44" r="38" fill="none" stroke={C.amber} strokeWidth="6" strokeLinecap="round"
          pathLength="100" strokeDasharray="100" className="shai-ring"
          transform="rotate(-90 44 44)"
        />
      </svg>
      <p className="mt-6" style={{ color: C.text, fontSize: 15, fontWeight: 600 }}>{LOADING_MESSAGES[msgIndex]}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Quiz screens                                                     */
/* ---------------------------------------------------------------- */

function QuizHeader({ stepIndex, onBack }) {
  return (
    <div className="px-5 pt-6 pb-2">
      <div className="flex items-center justify-between mb-5">
        <button onClick={onBack} className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, background: C.surface }}>
          <ArrowLeft size={16} color={C.textMuted} />
        </button>
        <TopBrand small />
        <div style={{ width: 34 }} />
      </div>
      <ProgressBar stepIndex={stepIndex} />
    </div>
  );
}

function QuestionTitle({ children, sub }) {
  return (
    <div className="mb-5">
      <h2 style={{ fontFamily: FONT_DISPLAY, color: C.text, fontSize: 24, fontWeight: 600, lineHeight: 1.3 }}>{children}</h2>
      {sub && <p className="mt-1.5" style={{ color: C.textFaint, fontSize: 13.5 }}>{sub}</p>}
    </div>
  );
}

function GoalStep({ answers, setAnswers }) {
  return (
    <div className="shai-step">
      <QuestionTitle sub="Pick a rough monthly target \u2014 you can be ambitious.">What's your monthly income goal?</QuestionTitle>
      <div className="flex flex-col gap-2.5">
        {GOAL_OPTIONS.map((g) => (
          <OptionRow
            key={g.id}
            label={g.label}
            icon={IndianRupee}
            selected={answers.goalTier === g.id}
            onClick={() => setAnswers((a) => ({ ...a, goalTier: g.id }))}
          />
        ))}
      </div>
      {answers.goalTier === "custom" && (
        <div className="mt-4 shai-step">
          <div className="flex items-baseline gap-2 px-1 py-2" style={{ borderBottom: `2px dashed ${C.borderStrong}` }}>
            <span style={{ color: C.amber, fontSize: 22, fontFamily: FONT_DISPLAY, fontWeight: 600 }}>\u20b9</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Enter your target amount"
              value={answers.goalCustom}
              onChange={(e) => setAnswers((a) => ({ ...a, goalCustom: e.target.value }))}
              className="flex-1 bg-transparent outline-none"
              style={{ color: C.text, fontSize: 22, fontFamily: FONT_DISPLAY, fontWeight: 600 }}
            />
            <span style={{ color: C.textFaint, fontSize: 13 }}>/ month</span>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeStep({ answers, setAnswers }) {
  return (
    <div className="shai-step">
      <QuestionTitle sub="Be realistic \u2014 the plan only works if you can keep it up.">How much time can you give it?</QuestionTitle>
      <div className="flex flex-col gap-2.5">
        {TIME_OPTIONS.map((t) => (
          <OptionRow
            key={t.id}
            label={t.label}
            icon={Clock}
            selected={answers.time === t.id}
            onClick={() => setAnswers((a) => ({ ...a, time: t.id }))}
          />
        ))}
      </div>
    </div>
  );
}

function SkillsStep({ answers, setAnswers }) {
  const toggle = (name) => {
    setAnswers((a) => ({
      ...a,
      skills: a.skills.includes(name) ? a.skills.filter((s) => s !== name) : [...a.skills, name],
    }));
  };
  return (
    <div className="shai-step">
      <QuestionTitle sub="Pick as many as apply. Not sure? Other works fine.">What skills do you already have?</QuestionTitle>
      <div className="flex flex-wrap gap-2">
        {SKILL_OPTIONS.map((s) => (
          <SkillChip
            key={s.name}
            name={s.name}
            Icon={s.icon}
            selected={answers.skills.includes(s.name)}
            onClick={() => toggle(s.name)}
          />
        ))}
      </div>
    </div>
  );
}

function BudgetStep({ answers, setAnswers }) {
  return (
    <div className="shai-step">
      <QuestionTitle sub="What you can put in up front, not what you hope to earn.">What's your starting budget?</QuestionTitle>
      <div className="flex flex-col gap-2.5">
        {BUDGET_OPTIONS.map((b) => (
          <OptionRow
            key={b.id}
            label={b.label}
            icon={Wallet}
            selected={answers.budget === b.id}
            onClick={() => setAnswers((a) => ({ ...a, budget: b.id }))}
          />
        ))}
      </div>
    </div>
  );
}

function WorkStep({ answers, setAnswers }) {
  return (
    <div className="shai-step">
      <QuestionTitle sub="What kind of work sounds most like you?">Preferred way of working</QuestionTitle>
      <div className="flex flex-col gap-2.5">
        {WORK_OPTIONS.map((w) => (
          <OptionRow
            key={w}
            label={w}
            icon={Briefcase}
            selected={answers.preferredWork === w}
            onClick={() => setAnswers((a) => ({ ...a, preferredWork: w }))}
          />
        ))}
      </div>
    </div>
  );
}

function LocationStep({ answers, setAnswers }) {
  return (
    <div className="shai-step">
      <QuestionTitle sub="This helps us tell local opportunities from online ones.">Where are you based?</QuestionTitle>
      <div className="flex flex-col gap-3 mb-5">
        <div>
          <label style={{ color: C.textFaint, fontSize: 12.5, marginBottom: 6, display: "block" }}>City</label>
          <input
            type="text"
            placeholder="e.g. Mumbai"
            value={answers.city}
            onChange={(e) => setAnswers((a) => ({ ...a, city: e.target.value }))}
            className="w-full rounded-2xl px-4 py-3.5 outline-none"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 15 }}
          />
        </div>
        <div>
          <label style={{ color: C.textFaint, fontSize: 12.5, marginBottom: 6, display: "block" }}>Country</label>
          <input
            type="text"
            placeholder="e.g. India"
            value={answers.country}
            onChange={(e) => setAnswers((a) => ({ ...a, country: e.target.value }))}
            className="w-full rounded-2xl px-4 py-3.5 outline-none"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: 15 }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <OptionRow
          label="Online only"
          icon={MapPin}
          selected={answers.mode === "online"}
          onClick={() => setAnswers((a) => ({ ...a, mode: "online" }))}
        />
        <OptionRow
          label="Local + online"
          icon={MapPin}
          selected={answers.mode === "local"}
          onClick={() => setAnswers((a) => ({ ...a, mode: "local" }))}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Results screen                                                   */
/* ---------------------------------------------------------------- */

function ResultsScreen({ answers, results, onRetake }) {
  const [expandedId, setExpandedId] = useState(results[0]?.id || null);
  const goalLabel = answers.goalTier === "custom"
    ? inr(Number(answers.goalCustom) || 0)
    : GOAL_OPTIONS.find((g) => g.id === answers.goalTier)?.label.replace(" / month", "");
  const timeOpt = TIME_OPTIONS.find((t) => t.id === answers.time);
  const budgetOpt = BUDGET_OPTIONS.find((b) => b.id === answers.budget);
  const skillsPreview = answers.skills.slice(0, 2).join(" and ") + (answers.skills.length > 2 ? ` +${answers.skills.length - 2} more` : "");

  return (
    <div className="shai-step">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <TopBrand small />
        <button onClick={onRetake} className="flex items-center gap-1.5 rounded-full px-3 py-2" style={{ background: C.surface }}>
          <RotateCcw size={13} color={C.textMuted} />
          <span style={{ color: C.textMuted, fontSize: 12, fontWeight: 600 }}>Retake</span>
        </button>
      </div>

      <div className="px-5 mb-5">
        <h2 style={{ fontFamily: FONT_DISPLAY, color: C.text, fontSize: 26, fontWeight: 600 }}>Your matches</h2>
        <p className="mt-2" style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>
          Matched to a {goalLabel} a month goal, {timeOpt?.label.toLowerCase()}, and {skillsPreview || "your profile"}.
        </p>
      </div>

      <div className="px-5 mb-6">
        <div className="rounded-2xl px-4 py-3.5" style={{ background: C.amberSoft, border: `1px solid rgba(242,167,59,0.3)` }}>
          <p style={{ color: C.text, fontSize: 12.5, lineHeight: 1.55 }}>
            Every income figure here is an estimate, not a promise. What you actually earn depends on your effort,
            local demand, and market conditions.
          </p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4 pb-10">
        {results.map((h, i) => (
          <HustleCard
            key={h.id}
            h={h}
            index={i}
            answers={answers}
            timeLabel={timeOpt?.label || ""}
            budgetLabel={budgetOpt?.label || ""}
            expanded={expandedId === h.id}
            onToggle={() => setExpandedId(expandedId === h.id ? null : h.id)}
          />
        ))}
      </div>

      <div className="px-5 pb-10 text-center">
        <p style={{ color: C.textFaint, fontSize: 11.5, lineHeight: 1.6 }}>
          Built for students and young adults juggling college, jobs, and side income.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Root app                                                         */
/* ---------------------------------------------------------------- */

const INITIAL_ANSWERS = {
  goalTier: null, goalCustom: "", time: null, skills: [], budget: null,
  preferredWork: null, city: "", country: "India", mode: null,
};

function isStepValid(stepIndex, answers) {
  if (stepIndex === 0) return answers.goalTier && (answers.goalTier !== "custom" || Number(answers.goalCustom) > 0);
  if (stepIndex === 1) return !!answers.time;
  if (stepIndex === 2) return answers.skills.length >= 1;
  if (stepIndex === 3) return !!answers.budget;
  if (stepIndex === 4) return !!answers.preferredWork;
  if (stepIndex === 5) return answers.city.trim() !== "" && answers.country.trim() !== "" && !!answers.mode;
  return false;
}

export default function SideHustleAI() {
  const [phase, setPhase] = useState("landing");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (phase === "loading") {
      const t = setTimeout(() => {
        setResults(computeRecommendations(answers));
        setPhase("results");
      }, 1650);
      return () => clearTimeout(t);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const goBack = () => {
    if (stepIndex === 0) setPhase("landing");
    else setStepIndex((i) => i - 1);
  };

  const goNext = () => {
    if (stepIndex === TOTAL_STEPS - 1) setPhase("loading");
    else setStepIndex((i) => i + 1);
  };

  const retake = () => {
    setAnswers(INITIAL_ANSWERS);
    setStepIndex(0);
    setResults([]);
    setPhase("landing");
  };

  const steps = [
    <GoalStep key="goal" answers={answers} setAnswers={setAnswers} />,
    <TimeStep key="time" answers={answers} setAnswers={setAnswers} />,
    <SkillsStep key="skills" answers={answers} setAnswers={setAnswers} />,
    <BudgetStep key="budget" answers={answers} setAnswers={setAnswers} />,
    <WorkStep key="work" answers={answers} setAnswers={setAnswers} />,
    <LocationStep key="location" answers={answers} setAnswers={setAnswers} />,
  ];

  const valid = isStepValid(stepIndex, answers);

  return (
    <div
      className="shai"
      style={{
        minHeight: "100vh",
        width: "100%",
        background: `radial-gradient(ellipse 600px 400px at 50% -10%, ${C.bgGlow}, ${C.bg} 65%)`,
        fontFamily: FONT_BODY,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <GlobalStyle />
      <div style={{ width: "100%", maxWidth: 440, minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
        {phase === "landing" && <LandingScreen onStart={() => setPhase("quiz")} />}

        {phase === "quiz" && (
          <div className="flex flex-col" style={{ flex: 1, paddingBottom: 100 }}>
            <QuizHeader stepIndex={stepIndex} onBack={goBack} />
            <div className="px-5 pt-4 flex-1">{steps[stepIndex]}</div>
          </div>
        )}

        {phase === "loading" && <LoadingScreen />}

        {phase === "results" && <ResultsScreen answers={answers} results={results} onRetake={retake} />}

        {phase === "quiz" && (
          <div
            className="fixed inset-x-0 bottom-0 flex justify-center"
            style={{ background: `linear-gradient(0deg, ${C.bg} 60%, transparent)`, paddingTop: 24 }}
          >
            <div style={{ width: "100%", maxWidth: 440 }} className="px-5 pb-6 pt-2">
              <PrimaryButton onClick={goNext} disabled={!valid}>
                {stepIndex === TOTAL_STEPS - 1 ? "See my matches" : "Continue"}
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
