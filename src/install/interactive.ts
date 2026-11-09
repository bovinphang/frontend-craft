import { createCliPrompts } from "@bovinphang/craft-common";
import { ALL_RUNTIMES } from "./registry.js";
import { getGlobalConfigDir, LOCAL_DIR } from "./runtime-homes.js";
export {
  createSelectablePromptState,
  renderSelectablePrompt,
} from "@bovinphang/craft-common";
const prompts = createCliPrompts({
  productName: "frontend-craft",
  runtimes: ALL_RUNTIMES,
  getGlobalConfigDir,
  localDirectories: LOCAL_DIR,
});
export const {
  RUNTIME_OPTIONS,
  ALL_RUNTIMES_CHOICE,
  createRuntimePromptState,
  createLocationPromptState,
  createLanguagePromptState,
  buildRuntimePromptText,
  parseRuntimeInput,
  buildLocationPromptText,
  parseLocationInput,
  buildLanguagePromptText,
  parseLanguageInput,
  promptRuntime,
  promptLocation,
  promptLanguage,
} = prompts;
