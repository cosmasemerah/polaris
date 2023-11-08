import React, {useRef} from 'react';
import {Transition} from 'react-transition-group';

import {classNames} from '../../utilities/css';
import type {Action} from '../../types';
import {UnstyledButton} from '../UnstyledButton';
import {Box} from '../Box';
import {Text} from '../Text';
import {InlineStack} from '../InlineStack';

import styles from './SelectAllActions.module.scss';

type TransitionStatus = 'entering' | 'entered' | 'exiting' | 'exited';

export interface SelectAllActionsProps {
  /** Label for the bulk actions */
  label?: string;
  /** List is in a selectable state */
  selectMode?: boolean;
  /** Text to select all across pages */
  paginatedSelectAllText?: string;
  /** Action for selecting all across pages */
  paginatedSelectAllAction?: Action;
  /** Disables bulk actions */
  disabled?: boolean;
  /** If the BulkActions is currently sticky in view */
  isSticky?: boolean;
}

export const SelectAllActions = ({
  label,
  selectMode,
  paginatedSelectAllText,
  paginatedSelectAllAction,
  disabled,
  isSticky,
}: SelectAllActionsProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const paginatedSelectAllActionMarkup = paginatedSelectAllAction ? (
    <UnstyledButton
      className={styles.AllAction}
      onClick={paginatedSelectAllAction.onAction}
      size="slim"
      disabled={disabled}
    >
      {paginatedSelectAllAction.content}
    </UnstyledButton>
  ) : null;

  const hasTextAndAction = paginatedSelectAllText && paginatedSelectAllAction;

  const paginatedSelectAllMarkup = paginatedSelectAllActionMarkup ? (
    <div className={styles.PaginatedSelectAll}>
      {paginatedSelectAllActionMarkup}
    </div>
  ) : null;

  const markup = (
    <Transition timeout={0} in={selectMode} key="markup" nodeRef={nodeRef}>
      {(status: TransitionStatus) => {
        const wrapperClasses = classNames(
          styles.SelectAllActions,
          !isSticky && styles['SelectAllActions-not-sticky'],
          status && styles[`SelectAllActions-${status}`],
        );

        return (
          <div className={wrapperClasses} ref={nodeRef}>
            <Box
              background="bg-surface-secondary"
              borderBlockStartWidth="025"
              borderColor="border"
              width="100%"
              paddingBlockStart="300"
              paddingBlockEnd="300"
              paddingInlineStart="400"
              paddingInlineEnd="400"
            >
              <InlineStack gap="200" align="start" blockAlign="center">
                <Text as="span" variant="bodySm" fontWeight="semibold">
                  {hasTextAndAction ? paginatedSelectAllText : label}
                </Text>
                {paginatedSelectAllMarkup}
              </InlineStack>
            </Box>
          </div>
        );
      }}
    </Transition>
  );
  return markup;
};
