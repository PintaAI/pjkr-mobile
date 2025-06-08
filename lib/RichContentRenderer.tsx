import React from 'react';
import { View, Text, ScrollView } from 'react-native';

interface RichContentRendererProps {
  jsonDescription?: string | null;
  fallbackDescription?: string | null;
  className?: string;
}

/**
 * Component to render rich content from course descriptions
 * Supports JSON (ProseMirror) format with fallback to plain text
 */
export function RichContentRenderer({
  jsonDescription,
  fallbackDescription,
  className = 'flex-1'
}: RichContentRendererProps) {
  // If we have JSON content, render it
  if (jsonDescription) {
    return <JsonContentRenderer json={jsonDescription} className={className} />;
  }

  // Fallback to plain text
  return <PlainTextRenderer text={fallbackDescription} className={className} />;
}

/**
 * Renders JSON (ProseMirror) content using native React Native components
 */
function JsonContentRenderer({ json, className }: { json: string; className: string }) {
  try {
    const parsedContent = JSON.parse(json);
    return (
      <ScrollView className={className} showsVerticalScrollIndicator={false}>
        <View className="p-1">
          {renderProseMirrorContent(parsedContent)}
        </View>
      </ScrollView>
    );
  } catch (error) {
    console.error('Failed to parse JSON content:', error);
    return (
      <View className={className}>
        <Text className="text-red-500 p-4">Failed to render content</Text>
      </View>
    );
  }
}

/**
 * Recursively renders ProseMirror content structure
 */
function renderProseMirrorContent(content: any): React.ReactNode {
  if (!content || !content.content) return null;

  return content.content.map((node: any, index: number) => {
    return renderProseMirrorNode(node, index);
  });
}

/**
 * Renders individual ProseMirror nodes
 */
function renderProseMirrorNode(node: any, key: number): React.ReactNode {
  switch (node.type) {
    case 'heading':
      return renderHeading(node, key);
    
    case 'paragraph':
      return renderParagraph(node, key);
    
    case 'bulletList':
      return renderBulletList(node, key);
    
    case 'listItem':
      return renderListItem(node, key);
    
    default:
      return null;
  }
}

/**
 * Renders heading nodes with proper styling and colors
 */
function renderHeading(node: any, key: number): React.ReactNode {
  const level = node.attrs?.level || 1;
  
  const headingStyles = {
    1: 'text-3xl font-bold mb-4 mt-6 text-primary',
    2: 'text-2xl font-bold mb-3 mt-5 text-primary',
    3: 'text-xl font-semibold mb-3 mt-4 text-primary',
    4: 'text-lg font-semibold mb-2 mt-3 text-primary',
    5: 'text-base font-semibold mb-2 mt-3 text-primary',
    6: 'text-sm font-semibold mb-2 mt-3 text-primary',
  };

  return (
    <Text key={key} className={headingStyles[level as keyof typeof headingStyles] || headingStyles[1]}>
      {node.content?.map((textNode: any, textIndex: number) => 
        renderTextNode(textNode, `${key}-${textIndex}`)
      )}
    </Text>
  );
}

/**
 * Renders paragraph nodes
 */
function renderParagraph(node: any, key: number): React.ReactNode {
  if (!node.content || node.content.length === 0) {
    return <View key={key} className="h-4" />;
  }

  return (
    <Text key={key} className="text-base leading-6 mb-4 text-primary">
      {node.content.map((textNode: any, textIndex: number) => 
        renderTextNode(textNode, `${key}-${textIndex}`)
      )}
    </Text>
  );
}

/**
 * Renders bullet list nodes
 */
function renderBulletList(node: any, key: number): React.ReactNode {
  if (!node.content) return null;

  return (
    <View key={key} className="mb-4">
      {node.content.map((listItem: any, itemIndex: number) => 
        renderListItem(listItem, itemIndex)
      )}
    </View>
  );
}

/**
 * Renders list item nodes
 */
function renderListItem(node: any, key: number): React.ReactNode {
  if (!node.content) return null;

  return (
    <View key={key} className="flex-row mb-1 items-start">
      <Text className="text-primary text-xs mr-1 mt-0 leading-6">●</Text>
      <View className="flex-1">
        {node.content.map((itemContent: any, contentIndex: number) => 
          renderProseMirrorNode(itemContent, contentIndex)
        )}
      </View>
    </View>
  );
}

/**
 * Renders text nodes with styling and colors
 */
function renderTextNode(textNode: any, key: string): React.ReactNode {
  if (textNode.type !== 'text') return null;

  const text = textNode.text || '';
  const marks = textNode.marks || [];
  
  let textStyle = 'text-primary';
  let isBold = false;
  let textColor = '';

  marks.forEach((mark: any) => {
    if (mark.type === 'bold') {
      isBold = true;
    }
    if (mark.type === 'textStyle' && mark.attrs?.color) {
      textColor = mark.attrs.color;
    }
  });

  if (isBold) {
    textStyle += ' font-bold';
  }

  const style: any = {};
  if (textColor) {
    style.color = textColor;
  }

  return (
    <Text key={key} className={textStyle} style={style}>
      {text}
    </Text>
  );
}

/**
 * Renders plain text fallback
 */
function PlainTextRenderer({ text, className }: { text?: string | null; className: string }) {
  if (!text) {
    return (
      <View className={className}>
        <Text className="text-primary p-4 italic">No content available</Text>
      </View>
    );
  }

  return (
    <ScrollView className={className} showsVerticalScrollIndicator={false}>
      <Text className="text-base leading-6 p-4 text-primary">{text}</Text>
    </ScrollView>
  );
}

export default RichContentRenderer;
