import { AspirationGoal, AspirationCategory } from "./types";

export const ASPIRATION_CATEGORIES: {
  name: AspirationCategory;
  type: "intrinsic" | "extrinsic" | "neutral";
  color: string;
  borderColor: string;
  bgColor: string;
  icon: string;
  description: string;
}[] = [
  {
    name: "Personal growth",
    type: "intrinsic",
    color: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-200 dark:border-emerald-800/40",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    icon: "Sprout",
    description: "Self-acceptance, autonomy, psychological maturity, and personal insight.",
  },
  {
    name: "Relationships",
    type: "intrinsic",
    color: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800/40",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    icon: "Users2",
    description: "Deep, enduring, and mutually supportive connections with loved ones and friends.",
  },
  {
    name: "Community",
    type: "intrinsic",
    color: "text-teal-600 dark:text-teal-400",
    borderColor: "border-teal-200 dark:border-teal-800/40",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
    icon: "HeartHandshake",
    description: "Working to make the world a better place, helping others, and helping those in need.",
  },
  {
    name: "Wealth",
    type: "extrinsic",
    color: "text-amber-600 dark:text-amber-400",
    borderColor: "border-amber-200 dark:border-amber-800/40",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    icon: "Coins",
    description: "Financial success, riches, expensive possessions, and luxury items.",
  },
  {
    name: "Fame",
    type: "extrinsic",
    color: "text-rose-600 dark:text-rose-400",
    borderColor: "border-rose-200 dark:border-rose-800/40",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
    icon: "Sparkles",
    description: "Being famous, admired or known by many people, and having a public media presence.",
  },
  {
    name: "Image",
    type: "extrinsic",
    color: "text-indigo-600 dark:text-indigo-400",
    borderColor: "border-indigo-200 dark:border-indigo-800/40",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    icon: "Shirt",
    description: "Physical appeal, fashionability, attracting praise, and hiding signs of aging.",
  },
  {
    name: "Health",
    type: "neutral",
    color: "text-sky-600 dark:text-sky-400",
    borderColor: "border-sky-200 dark:border-sky-800/40",
    bgColor: "bg-sky-50 dark:bg-sky-950/20",
    icon: "Activity",
    description: "Somatic wellness, physical fitness, freedom from sickness, and healthy habits.",
  },
];

export const ASPIRATION_GOALS: AspirationGoal[] = [
  { id: 1, category: "Wealth", text: "To be a very wealthy person." },
  { id: 2, category: "Personal growth", text: "To grow and learn new things." },
  { id: 3, category: "Fame", text: "To have my name known by many people." },
  { id: 4, category: "Relationships", text: "To have good friends that I can count on." },
  { id: 5, category: "Image", text: "To successfully hide the signs of aging." },
  { id: 6, category: "Community", text: "To work for the betterment of society." },
  { id: 7, category: "Health", text: "To be physically healthy." },
  { id: 8, category: "Wealth", text: "To have many expensive possessions." },
  {
    id: 9,
    category: "Personal growth",
    text: "At the end of my life, to be able to look back on my life as meaningful and complete.",
  },
  { id: 10, category: "Fame", text: "To be admired by many people." },
  { id: 11, category: "Relationships", text: "To share my life with someone I love." },
  { id: 12, category: "Image", text: "To have people comment often about how attractive I look." },
  { id: 13, category: "Community", text: "To assist people who need it, asking nothing in return." },
  { id: 14, category: "Health", text: "To feel good about my level of physical fitness." },
  { id: 15, category: "Wealth", text: "To be financially successful." },
  {
    id: 16,
    category: "Personal growth",
    text: "To choose what I do, instead of being pushed along by life.",
  },
  { id: 17, category: "Fame", text: "To be famous." },
  { id: 18, category: "Relationships", text: "To have committed, intimate relationships." },
  { id: 19, category: "Image", text: "To keep up with fashions in hair and clothing." },
  { id: 20, category: "Community", text: "To work to make the world a better place." },
  { id: 21, category: "Health", text: "To keep myself healthy and well." },
  { id: 22, category: "Wealth", text: "To be rich." },
  { id: 23, category: "Personal growth", text: "To know and accept who I really am." },
  { id: 24, category: "Fame", text: "To have my name appear frequently in the media." },
  {
    id: 25,
    category: "Relationships",
    text: "To feel that there are people who really love me, and whom I love.",
  },
  { id: 26, category: "Image", text: "To achieve the \"look\" I've been after." },
  { id: 27, category: "Community", text: "To help others improve their lives." },
  { id: 28, category: "Health", text: "To be relatively free from sickness." },
  { id: 29, category: "Wealth", text: "To have enough money to buy everything I want." },
  {
    id: 30,
    category: "Personal growth",
    text: "To gain increasing insight into why I do the things I do.",
  },
  { id: 31, category: "Fame", text: "To be admired by lots of different people." },
  { id: 32, category: "Relationships", text: "To have deep enduring relationships." },
  { id: 33, category: "Image", text: "To have an image that others find appealing." },
  { id: 34, category: "Community", text: "To help people in need." },
  { id: 35, category: "Health", text: "To have a physically healthy life style." },
];

export function getOfflineFeedback(
  relativeIndex: number,
  highestCategory: AspirationCategory,
  lowestCategory: AspirationCategory,
): { title: string; profile: string; advice: string } {
  let title = "The Harmonious Connector";
  let profile = "You seek balance between external objectives and internal peace. Your focus lies in aligning goals that connect you with people.";
  let advice = "Focus on nurturing your core friendships and learning for the sake of interest. Ensure your financial goals are means to facilitate security and help others, rather than ends in themselves.";

  if (relativeIndex >= 1.5) {
    title = "The Purpose-Driven Intrinsic Explorer";
    profile = "You place immense value on intrinsic aspirations like personal growth, meaningful relationships, and community contribution. Your motivation stems from deep-rooted values rather than seeking approval, luxury, or status. Self-Determination Theory indicates this mindset is highly correlated with overall well-being and lifelong vitality.";
    advice = "Continue cultivating deep self-acceptance and supporting your community. Your profile shines when you prioritize autonomy—choosing activities out of passion, curiosity, and ethical responsibility, rather than external rewards.";
  } else if (relativeIndex >= 0.5) {
    title = "The Balanced Realist";
    profile = "You balance intrinsic desires for healthy connections and personal wisdom with a realistic focus on external stability, such as financial standing or standard career appreciation. This balance is helpful when you use extrinsic rewards to build healthy foundations for your learning and relationships.";
    advice = "Make sure your goals in wealth or career correspond with your authentic values. When pursuing financial goals, try matching them to personal development, like enabling continuous learning, supporting family, or funding community projects.";
  } else if (relativeIndex <= -1.0) {
    title = "The External-Admiration Achiever";
    profile = "Your motivational profile emphasizes extrinsic reward channels: wealth, fame (or respect/praise), and public image. In psychology, this orientation is often spurred by social environments that encourage high competition, compliance, or external signs of success. While extrinsic goals drive sharp, disciplined focus, over-relying on others' validation can sometimes draw energy away from simple, peaceful self-acceptance.";
    advice = "Take moments to pursue activities purely for creative play or joy—without showing them on social media, earning money, or receiving praise. Cultivating simple offline hobbies, meditating on self-compassion, and strengthening relationships based on raw vulnerability can help balance extrinsic pressures.";
  } else {
    title = "The Social-Validation Seeker";
    profile = "Your scores indicate a central motivation of being viewed positively by others combined with social standing. You work diligently to present yourself elegantly and strive for material success. Creating space for self-analysis and deep relational bonds is key to keeping these outward goals fulfilling.";
    advice = "Try choosing one area of personal study or creativity that is an absolute secret. Challenge yourself to build connections where you reveal your imperfections so you experience being loved precisely as you are, rather than for a polished image.";
  }

  return { title, profile, advice };
}
