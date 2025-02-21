// Types
export type Scheme = 'auto' | 'dark' | 'light';
export type Screens = { [key: string]: string };
export type Theme = 'theme-default' | string;
export type Themes = { id: string; name: string }[];
export type TextColor = 'yellow' | string;
export type TextColors = { id: string; name: string, hex: string }[];
export type MenuColor = 'default' | string;
export type MenuColors = { id: string; name: string, hex: string }[];
export type MenuTextColor = 'default' | string;
export type MenuTextColors = { id: string; name: string, hex: string }[];


/**
 * AppConfig interface. Update this interface to strictly type your config
 * object.
 */
export interface FuseConfig {
    scheme: Scheme;

}
