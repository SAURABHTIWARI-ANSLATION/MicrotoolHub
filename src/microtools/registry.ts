// STEP 1: Import your tool's config and component
import { ToolModule } from "./types";
import { config as exampleToolConfig } from "./example-tool/config";
import ExampleToolComponent from "./example-tool/index";

// Import typing masters tool
import { config as typingMastersConfig } from "./typing masters/config";
import TypingMastersComponent from "./typing masters/index";

// Import prompt painter react tool
import { config as promptPainterConfig } from "./prompt-painter-react/config";
import PromptPainterComponent from "./prompt-painter-react/index";

// Import age calculator tool
import { config as ageCalculatorConfig } from "./age-calculator/config";
import AgeCalculatorComponent from "./age-calculator/index";

// Import CSV to JSON tool
import { config as csvToJsonConfig } from "./CSV-to-JSON/config";
import CsvToJsonComponent from "./CSV-to-JSON/index";

// Import YouTube Video Analyzer tool
import { config as youtubeVideoAnalyzerConfig } from "./youtube_video_analyzer/config";
import YoutubeVideoAnalyzerComponent from "./youtube_video_analyzer/index";

// Import flowchart tool
import { config as flowchartConfig } from "./flowchart/config";
import FlowchartComponent from "./flowchart/index";

// Import quiz tool
import { config as quizConfig } from "./quiz/config";
import QuizComponent from "./quiz/index";

// Import unit converter tool
import { config as unitConverterConfig } from "./unit-converter/config";
import UnitConverterComponent from "./unit-converter/index";

// Import image cropper tool
import { config as imageCropperConfig } from "./Image-Cropper-tool/config";
import ImageCropperComponent from "./Image-Cropper-tool/index";

// Import background remover tool
import { config as backgroundRemoverConfig } from "./background-remover/config";
import BackgroundRemoverComponent from "./background-remover/index";

// Import grammar checker tool
import { config as grammarCheckerConfig } from "./Grammerchecker/config";
import GrammarCheckerComponent from "./Grammerchecker/index";

// Import URL redirect tracer tool
import { config as urlRedirectTracerConfig } from "./URL/config";
import URLRedirectTracerComponent from "./URL/index";

// Import screenshot tool
import { config as screenshotToolConfig } from "./screenshot-tool-animated/config";
import ScreenshotToolComponent from "./screenshot-tool-animated/index";

// Import Hashtag Hustle Magic tool
import { config as hashtagHustleMagicConfig } from "./Hastag Gen/hashtag-hustle-magic/config";
import HashtagHustleMagicComponent from "./Hastag Gen/hashtag-hustle-magic/index";

// Import Harry Potter Pencil Writer tool
import { config as harryPotterPencilWriterConfig } from "./Harry Potter Pencil Writer/config";
import HarryPotterPencilWriterComponent from "./Harry Potter Pencil Writer/index";

// Import Cam browser tool
import { config as camBrowserConfig } from "./Cam browser/browser-camera/config";
import CamBrowserComponent from "./Cam browser/browser-camera/index";

// Import Rich Text Editor tool
import { config as richTextEditorConfig } from "./Rich Data Editor/rich-tiptap-react/config";
import RichTextEditorComponent from "./Rich Data Editor/rich-tiptap-react/index";

// Import Brain Checker tool
import { config as brainCheckerConfig } from "./brain checker/brain-quest-mania/config";
import BrainCheckerComponent from "./brain checker/brain-quest-mania/index";

// Import Fake Data Generator tool
import { config as fakeDataGeneratorConfig } from "./fake data/browser-data-maker/config";
import FakeDataGeneratorComponent from "./fake data/browser-data-maker/index";

// Import Speed Test tool
import { config as speedTestConfig } from "./speed test tool/warp-speed-test/config";
import SpeedTestComponent from "./speed test tool/warp-speed-test/index";

// Import Vehicle Compare tool
import { config as vehicleCompareConfig } from "./vehicle compare/config";
import VehicleCompareComponent from "./vehicle compare/index";

// Import Calendar Panchang tool
import { config as calendarPanchangConfig } from "./calender/config";
import CalendarPanchangComponent from "./calender/index";

// STEP 2: Add your tool to this registry
// Just copy the pattern below for each new tool
export const toolsRegistry: ToolModule[] = [
  {
    config: exampleToolConfig,
    component: ExampleToolComponent,
  },
  {
    config: typingMastersConfig,
    component: TypingMastersComponent,
  },
  {
    config: promptPainterConfig,
    component: PromptPainterComponent,
  },
  {
    config: ageCalculatorConfig,
    component: AgeCalculatorComponent,
  },
  {
    config: csvToJsonConfig,
    component: CsvToJsonComponent,
  },
  {
    config: youtubeVideoAnalyzerConfig,
    component: YoutubeVideoAnalyzerComponent,
  },
  {
    config: flowchartConfig,
    component: FlowchartComponent,
  },
  {
    config: quizConfig,
    component: QuizComponent,
  },
  {
    config: unitConverterConfig,
    component: UnitConverterComponent,
  },
  {
    config: imageCropperConfig,
    component: ImageCropperComponent,
  },
  {
    config: backgroundRemoverConfig,
    component: BackgroundRemoverComponent,
  },
  {
    config: grammarCheckerConfig,
    component: GrammarCheckerComponent,
  },
  {
    config: urlRedirectTracerConfig,
    component: URLRedirectTracerComponent,
  },
  {
    config: screenshotToolConfig,
    component: ScreenshotToolComponent,
  },
  {
    config: hashtagHustleMagicConfig,
    component: HashtagHustleMagicComponent,
  },
  {
    config: harryPotterPencilWriterConfig,
    component: HarryPotterPencilWriterComponent,
  },
  {
    config: camBrowserConfig,
    component: CamBrowserComponent,
  },
  {
    config: richTextEditorConfig,
    component: RichTextEditorComponent,
  },
  {
    config: brainCheckerConfig,
    component: BrainCheckerComponent,
  },
  {
    config: fakeDataGeneratorConfig,
    component: FakeDataGeneratorComponent,
  },
  {
    config: speedTestConfig,
    component: SpeedTestComponent,
  },
  {
    config: vehicleCompareConfig,
    component: VehicleCompareComponent,
  },
  {
    config: calendarPanchangConfig,
    component: CalendarPanchangComponent,
  },
  // {
  //   config: otpConfig,
  //   component: OtpComponent,
  // },
  // Add more tools here following the same pattern:
  // {
  //   config: yourToolConfig,
  //   component: YourToolComponent,
  // },
];

// Auto-generate routes and categories
export const toolRoutes = toolsRegistry.map(tool => ({
  path: `/tools/${tool.config.id}`,
  config: tool.config,
  component: tool.component,
}));

export const categories = Array.from(
  new Set(toolsRegistry.map(tool => tool.config.category))
);

export const featuredTools = toolsRegistry.filter(tool => tool.config.featured);