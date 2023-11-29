import React from 'react';
import {mountWithApp} from 'tests/utilities';

import {Portal} from '../../Portal';
import {PositionedOverlay} from '../../PositionedOverlay';
import {HoverCard} from '../HoverCard';

const defaultProps = {
  active: false,
  toggleActive: jest.fn(),
  activator: <div>Activator</div>,
};

describe('<HoverCard />', () => {
  it('renders a portal when active', () => {
    const hoverCard = mountWithApp(<HoverCard {...defaultProps} active />);
    expect(hoverCard).toContainReactComponent(Portal);
  });

  it('renders an activator', () => {
    const hoverCard = mountWithApp(<HoverCard {...defaultProps} active />);
    expect(hoverCard).toContainReactComponent('div', {children: 'Activator'});
  });

  it('renders a positionedOverlay when active is true', () => {
    const hoverCard = mountWithApp(<HoverCard {...defaultProps} active />);
    expect(hoverCard).toContainReactComponent(PositionedOverlay);
  });

  it('doesn’t render a hoverCard when active is false', () => {
    const hoverCard = mountWithApp(<HoverCard {...defaultProps} />);
    expect(hoverCard).not.toContainReactComponent(PositionedOverlay);
  });

  it("passes 'preferredPosition' to PositionedOverlay", () => {
    const hoverCard = mountWithApp(
      <HoverCard {...defaultProps} active preferredPosition="above" />,
    );

    expect(hoverCard).toContainReactComponent(PositionedOverlay, {
      preferredPosition: 'above',
    });
  });

  it("passes 'preferredAlignment' to PositionedOverlay", () => {
    const hoverCard = mountWithApp(
      <HoverCard {...defaultProps} active preferredAlignment="left" />,
    );

    expect(hoverCard).toContainReactComponent(PositionedOverlay, {
      preferredAlignment: 'left',
    });
  });

  it('has a span as activatorWrapper by default', () => {
    const hoverCard = mountWithApp(<HoverCard {...defaultProps} />);
    expect(hoverCard.children[0].type).toBe('span');
  });

  it('has a div as activatorWrapper when activatorWrapper prop is set to div', () => {
    const hoverCard = mountWithApp(
      <HoverCard {...defaultProps} activatorWrapper="div" />,
    );
    expect(hoverCard.children[0].type).toBe('div');
  });

  it('passes fullWidth to PositionedOverlay', () => {
    const hoverCard = mountWithApp(
      <HoverCard {...defaultProps} active fullWidth />,
    );

    expect(hoverCard).toContainReactComponent(PositionedOverlay, {
      fullWidth: true,
    });
  });

  it("passes 'zIndexOverride' to PositionedOverlay", () => {
    const hoverCard = mountWithApp(
      <HoverCard {...defaultProps} active zIndexOverride={100} />,
    );

    expect(hoverCard).toContainReactComponent(PositionedOverlay, {
      zIndexOverride: 100,
    });
  });
});
