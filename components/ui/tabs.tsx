import * as TabsPrimitive from '@rn-primitives/tabs';
import * as React from 'react';
import { cn } from '~/lib/utils';
import { TextClassContext } from '~/components/ui/text';

const Tabs = TabsPrimitive.Root;

function TabsList({
  className,
  ...props
}: TabsPrimitive.ListProps & {
  ref?: React.RefObject<TabsPrimitive.ListRef>;
}) {
  return (
    <TabsPrimitive.List
      className={cn(
        'web:inline-flex h-12 native:h-14 items-center justify-center bg-transparent border-b border-border/20',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: TabsPrimitive.TriggerProps & {
  ref?: React.RefObject<TabsPrimitive.TriggerRef>;
}) {
  const { value } = TabsPrimitive.useRootContext();
  const isActive = value === props.value;
  
  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm native:text-base',
        isActive
          ? 'text-primary font-medium'
          : 'text-muted-foreground/70 font-normal'
      )}
    >
      <TabsPrimitive.Trigger
        className={cn(
          'inline-flex items-center justify-center web:whitespace-nowrap px-4 py-3 native:py-3.5 text-sm font-medium web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-primary web:focus-visible:ring-offset-2 relative',
          'border-b-2',
          props.disabled && 'web:pointer-events-none opacity-50',
          isActive
            ? 'border-b-primary text-primary'
            : 'border-b-transparent text-muted-foreground',
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.ContentProps & {
  ref?: React.RefObject<TabsPrimitive.ContentRef>;
}) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-primary web:focus-visible:ring-offset-2 web:animate-in web:fade-in-0 web:slide-in-from-bottom-2 web:duration-200',
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
