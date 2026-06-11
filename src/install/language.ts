import fs from "node:fs";
import path from "node:path";

export const DEFAULT_LANGUAGE = "en";
export const SUPPORTED_LANGUAGES = ["en", "zh-CN"] as const;

export type InstallLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function isInstallLanguage(value: string): value is InstallLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export function parseInstallLanguage(value: string | undefined): InstallLanguage | undefined {
  if (value == null) return undefined;
  return isInstallLanguage(value) ? value : undefined;
}

export function resolveInstallLanguage(value: string | undefined): InstallLanguage {
  return parseInstallLanguage(value) ?? DEFAULT_LANGUAGE;
}

export function resolveContentRoot(pluginRoot: string, language: InstallLanguage): string {
  if (language === DEFAULT_LANGUAGE) return pluginRoot;

  const localizedRoot = path.join(pluginRoot, "localized", language);
  if (!fs.existsSync(localizedRoot)) {
    throw new Error(`Missing localized content pack for language "${language}": ${localizedRoot}`);
  }
  return localizedRoot;
}
