import { expandCollapse } from './expand-collapse';
import { fadeIn, fadeInBottom, fadeInLeft, fadeInOut, fadeInRight, fadeInTop, fadeOut, fadeOutBottom, fadeOutLeft, fadeOutRight, fadeOutTop } from './fade';
import { shake } from './shake';
import { slideInBottom, slideInLeft, slideInRight, slideInTop, slideOutBottom, slideOutLeft, slideOutRight, slideOutTop } from './slide';
import { zoomIn, zoomOut } from './zoom';

export const fuseAnimations = [
    expandCollapse, fadeInOut,
    fadeIn, fadeInTop, fadeInBottom, fadeInLeft, fadeInRight,
    fadeOut, fadeOutTop, fadeOutBottom, fadeOutLeft, fadeOutRight,
    shake,
    slideInTop, slideInBottom, slideInLeft, slideInRight,
    slideOutTop, slideOutBottom, slideOutLeft, slideOutRight,
    zoomIn, zoomOut
];
