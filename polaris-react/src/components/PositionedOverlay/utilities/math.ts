import {Rect} from '../../../utilities/geometry';

export type PreferredPosition =
  | 'above'
  | 'below'
  | 'mostSpace'
  | 'right'
  | 'left';

export type PreferredAlignment = 'left' | 'center' | 'right';

export interface Margins {
  activator: number;
  container: number;
  horizontal: number;
}

export function calculateVerticalPosition(
  activatorRect: Rect,
  overlayRect: Rect,
  overlayMargins: Margins,
  scrollableContainerRect: Rect,
  containerRect: Rect,
  preferredPosition: PreferredPosition,
  fixed: boolean | undefined,
  topBarOffset = 0,
) {
  const activatorTop = activatorRect.top;
  const activatorBottom = activatorTop + activatorRect.height;
  const spaceAbove = activatorRect.top - topBarOffset;
  const spaceBelow =
    containerRect.height - activatorRect.top - activatorRect.height;

  const desiredHeight = overlayRect.height;
  const verticalMargins = overlayMargins.activator + overlayMargins.container;
  const minimumSpaceToScroll = overlayMargins.container;
  const distanceToTopScroll =
    activatorRect.top - Math.max(scrollableContainerRect.top, 0);
  const distanceToBottomScroll =
    containerRect.top +
    Math.min(
      containerRect.height,
      scrollableContainerRect.top + scrollableContainerRect.height,
    ) -
    (activatorRect.top + activatorRect.height);
  const enoughSpaceFromTopScroll = distanceToTopScroll >= minimumSpaceToScroll;
  const enoughSpaceFromBottomScroll =
    distanceToBottomScroll >= minimumSpaceToScroll;
  const heightIfBelow = Math.min(spaceBelow, desiredHeight);
  const heightIfAbove = Math.min(spaceAbove, desiredHeight);
  const containerRectTop = fixed ? 0 : containerRect.top;

  const positionIfAbove =
    preferredPosition === 'right' || preferredPosition === 'left'
      ? {
          height: desiredHeight - verticalMargins,
          top: activatorBottom + containerRectTop - heightIfAbove,
          positioning: 'above',
        }
      : {
          height: heightIfAbove - verticalMargins,
          top: activatorTop + containerRectTop - heightIfAbove,
          positioning: 'above',
        };

  const positionIfBelow =
    preferredPosition === 'right' || preferredPosition === 'left'
      ? {
          height: desiredHeight - verticalMargins,
          top: activatorTop + containerRectTop,
          positioning: 'below',
        }
      : {
          height: heightIfBelow - verticalMargins,
          top: activatorBottom + containerRectTop,
          positioning: 'below',
        };

  if (preferredPosition === 'above') {
    return (enoughSpaceFromTopScroll ||
      (distanceToTopScroll >= distanceToBottomScroll &&
        !enoughSpaceFromBottomScroll)) &&
      (spaceAbove > desiredHeight || spaceAbove > spaceBelow)
      ? positionIfAbove
      : positionIfBelow;
  }

  if (preferredPosition === 'below') {
    return (enoughSpaceFromBottomScroll ||
      (distanceToBottomScroll >= distanceToTopScroll &&
        !enoughSpaceFromTopScroll)) &&
      (spaceBelow > desiredHeight || spaceBelow > spaceAbove)
      ? positionIfBelow
      : positionIfAbove;
  }

  if (enoughSpaceFromTopScroll && enoughSpaceFromBottomScroll) {
    return spaceAbove > spaceBelow ? positionIfAbove : positionIfBelow;
  }

  return distanceToTopScroll > minimumSpaceToScroll
    ? positionIfAbove
    : positionIfBelow;
}

export function calculateHorizontalPosition(
  activatorRect: Rect,
  overlayRect: Rect,
  containerRect: Rect,
  overlayMargins: Margins,
  preferredAlignment: PreferredAlignment,
  // scrollableContainerRect: Rect,
  preferredPosition?: PreferredPosition,
) {
  const maximum = containerRect.width - overlayRect.width;
  // const spaceLeft = scrollableContainerRect.left - activatorRect.left;
  // const spaceRight = activatorRect.right - scrollableContainerRect.left;
  // const distanceToLeftScroll =
  //   activatorRect.left - Math.max(scrollableContainerRect.left, 0);
  // const distanceToRightScroll =
  //   activatorRect.right - Math.max(scrollableContainerRect.right, 0);
  // const enoughSpaceForLeftScroll =
  //   distanceToLeftScroll >= overlayMargins.container;
  // const enoughSpaceForRightScroll =
  //   distanceToRightScroll >= overlayMargins.container;
  // const positionIfRight = activatorRect.right;
  // const positionIfLeft = activatorRect.left;
  const activatorLeft = activatorRect.left - overlayRect.width;
  const activatorRight =
    containerRect.width - (activatorRect.left + activatorRect.width);

  if (!preferredPosition) {
    if (preferredAlignment === 'left') {
      return Math.min(
        maximum,
        Math.max(0, activatorRect.left - overlayMargins.horizontal),
      );
    } else if (preferredAlignment === 'right') {
      return Math.min(
        maximum,
        Math.max(0, activatorRight - overlayMargins.horizontal),
      );
    }

    return Math.min(
      maximum,
      Math.max(0, activatorRect.center.x - overlayRect.width / 2),
    );
  }

  if (preferredPosition === 'right') {
    return activatorRect.right;
  } else if (preferredPosition === 'left') {
    return activatorLeft;
  }

  return Math.min(
    maximum,
    Math.max(0, activatorRect.center.x - overlayRect.width / 2),
  );
}

export function rectIsOutsideOfRect(inner: Rect, outer: Rect) {
  const {center} = inner;

  return center.y < outer.top || center.y > outer.top + outer.height;
}

export function intersectionWithViewport(
  rect: Rect,
  viewport: Rect = windowRect(),
) {
  const top = Math.max(rect.top, 0);
  const left = Math.max(rect.left, 0);
  const bottom = Math.min(rect.top + rect.height, viewport.height);
  const right = Math.min(rect.left + rect.width, viewport.width);

  return new Rect({
    top,
    left,
    height: bottom - top,
    width: right - left,
  });
}

export function windowRect() {
  return new Rect({
    top: window.scrollY,
    left: window.scrollX,
    height: window.innerHeight,
    width: document.body.clientWidth,
  });
}
