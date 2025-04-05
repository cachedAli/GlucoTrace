import { FaDroplet, FaClock } from "react-icons/fa6";
import { BsHourglassSplit } from "react-icons/bs";
import { IoCalendarOutline, IoBarChart } from "react-icons/io5";
import { FiTarget } from "react-icons/fi";
import { LuRuler, LuNotepadText, LuRefreshCw } from "react-icons/lu";
import { PiForkKnifeFill, PiSunHorizonFill } from "react-icons/pi";
import { FaShieldAlt } from "react-icons/fa";
import { TiWarning } from "react-icons/ti";
import { GiCorkedTube } from "react-icons/gi";

export const overviewStats = [
    {
        title: "Current value",
        value: "120mg/dl",
        icon: FaDroplet,
        bgIcon: BsHourglassSplit,
        trend: "+12%",
        timeFrame: "Last 30 days",
        isOverview: true,
    },
    {
        title: "7-Day Average",
        value: "120mg/dl",
        icon: IoBarChart,
        bgIcon: IoCalendarOutline,
        trend: "+12%",
        timeFrame: "Your average blood sugar this week",
        isOverview: true,
    },
    {
        title: "Time in Range",
        value: "85%",
        icon: LuRuler,
        bgIcon: FiTarget,
        trend: "+1%",
        timeFrame: "3% from yesterday",
        isOverview: true,
    },
]

export const addReadingStats = [
    {
        title: "Last Reading",
        value: "120mg/dl",
        icon: LuNotepadText,
        timeFrame: "Last 4 hours",
        description: "Track reading again",
        isOverview: false,
    },
    {
        title: "Impact of Meals on Glucose",
        value: "+40 mg/dL",
        icon: PiForkKnifeFill,
        timeFrame: "Today",
        description: "Your glucose rises significantly after meals. Consider adjusting meal portions!",
        isOverview: false,
    },
    {
        title: "Your Target Range",
        value: "70–180 mg/dL",
        icon: FaShieldAlt,
        trend: "+1%",
        // timeFrame: "3% from yesterday",
        description: "Your last 5 readings were above target. Review your meals or medication.",
        isOverview: false,
    },
]

export const readingsHistoryStats = [
    {
        title: "Readings This Week",
        value: "28 entries",
        icon: IoCalendarOutline,
        timeFrame: "since last week",
        isOverview: false,
    },
    {
        title: " High/Low Episodes",
        value: "5 highs",
        icon: TiWarning,
        timeFrame: "Today",
        description: "Highs are higher than last week. Check your meals!",
        trend: "20%",
        isOverview: false,
    },
    {
        title: "Best Day for Readings",
        value: "Monday",
        icon: FaClock,
        timeFrame: "since last week",
        description: "Try tracking every day for a full picture!",
        isOverview: false,
    },
]

export const trendStats = [
    {
        title: "1-Month Change",
        value: "3% decrease",
        icon: LuRefreshCw,
        timeFrame: "since last month",
        isOverview: false,
    },
    {
        title: " Morning vs. Evening Averages",
        value: "112 mg/dl",
        icon: PiSunHorizonFill,
        timeFrame: "Today",
        description: "Highs are higher than last week. Check your meals!",
        trend: "20%",
        isOverview: false,
    },
    {
        title: "Estimated HbA1c",
        value: "11.2",
        icon: GiCorkedTube,
        timeFrame: "since last month",
        description: "Try tracking every day for a full picture!",
        isOverview: false,
    },
]