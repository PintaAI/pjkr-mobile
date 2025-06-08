import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Progress } from './progress';
import { Skeleton } from './skeleton';
import { Text } from './text';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { Info } from '~/lib/icons/Info';
import { MoonStar } from '~/lib/icons/MoonStar';
import { Sun } from '~/lib/icons/Sun';
import { Heart, Settings } from 'lucide-react-native';
import { iconWithClassName } from '~/lib/icons/iconWithClassName';
import { RichContentRenderer } from '~/lib/RichContentRenderer';

// Configure new icons with className support
iconWithClassName(Heart);
iconWithClassName(Settings);

// Test data for RichContentRenderer
const sampleJsonContent = JSON.stringify({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Course Overview' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This is a comprehensive course covering ' },
        { type: 'text', text: 'advanced topics', marks: [{ type: 'bold' }] },
        { type: 'text', text: ' in mobile development.' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Learning Objectives' }]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Master React Native fundamentals' }]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Build ' },
                { type: 'text', text: 'production-ready', marks: [{ type: 'bold' }] },
                { type: 'text', text: ' applications' }
              ]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Implement advanced UI patterns' }]
            }
          ]
        }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Prerequisites' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Basic knowledge of ' },
        { type: 'text', text: 'JavaScript', marks: [{ type: 'textStyle', attrs: { color: '#3b82f6' } }] },
        { type: 'text', text: ' and ' },
        { type: 'text', text: 'React', marks: [{ type: 'textStyle', attrs: { color: '#10b981' } }] },
        { type: 'text', text: ' is required.' }
      ]
    }
  ]
});

const complexJsonContent = JSON.stringify({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Advanced Features Demo' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This content demonstrates ' },
        { type: 'text', text: 'colored text', marks: [{ type: 'textStyle', attrs: { color: '#ef4444' } }] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'bold formatting', marks: [{ type: 'bold' }] },
        { type: 'text', text: ', and various heading levels.' }
      ]
    },
    {
      type: 'heading',
      attrs: { level: 4 },
      content: [{ type: 'text', text: 'Nested Lists' }]
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'First item with ' },
                { type: 'text', text: 'emphasis', marks: [{ type: 'bold' }] }
              ]
            }
          ]
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Second item with ' },
                { type: 'text', text: 'custom color', marks: [{ type: 'textStyle', attrs: { color: '#a855f7' } }] }
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'paragraph',
      content: []
    },
    {
      type: 'heading',
      attrs: { level: 6 },
      content: [{ type: 'text', text: 'Smallest Heading Level' }]
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This paragraph contains ' },
        { type: 'text', text: 'multiple', marks: [{ type: 'bold' }] },
        { type: 'text', text: ' ' },
        { type: 'text', text: 'formatted', marks: [{ type: 'textStyle', attrs: { color: '#f59e0b' } }] },
        { type: 'text', text: ' ' },
        { type: 'text', text: 'words', marks: [{ type: 'bold' }, { type: 'textStyle', attrs: { color: '#059669' } }] },
        { type: 'text', text: ' to test rendering.' }
      ]
    }
  ]
});



const plainTextContent = `This is a plain text fallback example.

It contains multiple paragraphs and should be rendered as simple text when JSON parsing fails or when no JSON content is provided.

This demonstrates the fallback functionality of the RichContentRenderer component.`;

export function UITest() {
  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="gap-8">
        {/* Header */}
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">UI Component Test</Text>
          <Text className="text-muted-foreground">Testing all available components and colors</Text>
        </View>

        {/* Color Palette */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>Available color tokens from global.css</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              {/* Primary Colors */}
              <View className="gap-2">
                <Text className="font-semibold">Primary Colors</Text>
                <View className="flex-row gap-2 flex-wrap">
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-primary rounded shadow-sm" />
                    <Text className="text-xs">primary</Text>
                  </View>
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-primary-foreground rounded shadow-sm border border-border" />
                    <Text className="text-xs">primary-fg</Text>
                  </View>
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-secondary rounded shadow-sm" />
                    <Text className="text-xs">secondary</Text>
                  </View>
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-secondary-foreground rounded shadow-sm" />
                    <Text className="text-xs">secondary-fg</Text>
                  </View>
                </View>
              </View>

              {/* Background Colors */}
              <View className="gap-2">
                <Text className="font-semibold">Background Colors</Text>
                <View className="flex-row gap-2 flex-wrap">
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-background rounded shadow-sm border border-border" />
                    <Text className="text-xs">background</Text>
                  </View>
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-card rounded shadow-sm border border-border" />
                    <Text className="text-xs">card</Text>
                  </View>
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-muted rounded shadow-sm" />
                    <Text className="text-xs">muted</Text>
                  </View>
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-accent rounded shadow-sm" />
                    <Text className="text-xs">accent</Text>
                  </View>
                </View>
              </View>

              {/* State Colors */}
              <View className="gap-2">
                <Text className="font-semibold">State Colors</Text>
                <View className="flex-row gap-2 flex-wrap">
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-destructive rounded shadow-sm" />
                    <Text className="text-xs">destructive</Text>
                  </View>
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-success rounded shadow-sm" />
                    <Text className="text-xs">success</Text>
                  </View>
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-fail rounded shadow-sm" />
                    <Text className="text-xs">fail</Text>
                  </View>
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-border rounded shadow-sm" />
                    <Text className="text-xs">border</Text>
                  </View>
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-input rounded shadow-sm" />
                    <Text className="text-xs">input</Text>
                  </View>
                  <View className="gap-1 items-center">
                    <View className="w-12 h-12 bg-ring rounded shadow-sm" />
                    <Text className="text-xs">ring</Text>
                  </View>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Shadow Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Shadow Examples</CardTitle>
            <CardDescription>Different shadow variations and colors</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              {/* Default Shadows */}
              <View className="gap-2">
                <Text className="font-semibold">Default Shadows</Text>
                <View className="flex-row gap-3 flex-wrap">
                  <View className="w-20 h-20 bg-card rounded shadow-sm border border-border items-center justify-center">
                    <Text className="text-xs">shadow-sm</Text>
                  </View>
                  <View className="w-20 h-20 bg-card rounded shadow border border-border items-center justify-center">
                    <Text className="text-xs">shadow</Text>
                  </View>
                  <View className="w-20 h-20 bg-card rounded shadow-md border border-border items-center justify-center">
                    <Text className="text-xs">shadow-md</Text>
                  </View>
                  <View className="w-20 h-20 bg-card rounded shadow-lg border border-border items-center justify-center">
                    <Text className="text-xs">shadow-lg</Text>
                  </View>
                </View>
              </View>

              {/* Colored Shadows */}
              <View className="gap-2">
                <Text className="font-semibold">Colored Shadows</Text>
                <View className="gap-3">
                  <View className="flex-row gap-3 flex-wrap">
                    <View className="w-20 h-20 bg-white rounded shadow-lg shadow-red-500/25 items-center justify-center">
                      <Text className="text-xs text-red-500">red</Text>
                    </View>
                    <View className="w-20 h-20 bg-white rounded shadow-lg shadow-blue-500/25 items-center justify-center">
                      <Text className="text-xs text-blue-500">blue</Text>
                    </View>
                    <View className="w-20 h-20 bg-white rounded shadow-lg shadow-green-500/25 items-center justify-center">
                      <Text className="text-xs text-green-500">green</Text>
                    </View>
                    <View className="w-20 h-20 bg-white rounded shadow-lg shadow-purple-500/25 items-center justify-center">
                      <Text className="text-xs text-purple-500">purple</Text>
                    </View>
                  </View>
                  <View className="flex-row gap-3 flex-wrap">
                    <View className="w-20 h-20 bg-white rounded shadow-lg shadow-yellow-500/25 items-center justify-center">
                      <Text className="text-xs text-yellow-600">yellow</Text>
                    </View>
                    <View className="w-20 h-20 bg-white rounded shadow-lg shadow-pink-500/25 items-center justify-center">
                      <Text className="text-xs text-pink-500">pink</Text>
                    </View>
                    <View className="w-20 h-20 bg-white rounded shadow-lg shadow-cyan-500/25 items-center justify-center">
                      <Text className="text-xs text-cyan-500">cyan</Text>
                    </View>
                    <View className="w-20 h-20 bg-white rounded shadow-lg shadow-orange-500/25 items-center justify-center">
                      <Text className="text-xs text-orange-500">orange</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Shadow Intensity */}
              <View className="gap-2">
                <Text className="font-semibold">Shadow Intensity</Text>
                <View className="flex-row gap-3 flex-wrap">
                  <View className="w-20 h-20 bg-white rounded shadow-lg shadow-blue-500/10 items-center justify-center">
                    <Text className="text-xs text-blue-500">10%</Text>
                  </View>
                  <View className="w-20 h-20 bg-white rounded shadow-lg shadow-blue-500/25 items-center justify-center">
                    <Text className="text-xs text-blue-500">25%</Text>
                  </View>
                  <View className="w-20 h-20 bg-white rounded shadow-lg shadow-blue-500/50 items-center justify-center">
                    <Text className="text-xs text-blue-500">50%</Text>
                  </View>
                  <View className="w-20 h-20 bg-white rounded shadow-lg shadow-blue-500/75 items-center justify-center">
                    <Text className="text-xs text-blue-500">75%</Text>
                  </View>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button Components</CardTitle>
            <CardDescription>All button variants and sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              {/* Button Variants */}
              <View className="gap-2">
                <Text className="font-semibold">Variants</Text>
                <View className="gap-2">
                  <Button><Text>Default</Text></Button>
                  <Button variant="destructive"><Text>Destructive</Text></Button>
                  <Button variant="outline"><Text>Outline</Text></Button>
                  <Button variant="secondary"><Text>Secondary</Text></Button>
                  <Button variant="ghost"><Text>Ghost</Text></Button>
                  <Button variant="link"><Text>Link</Text></Button>
                </View>
              </View>

              {/* Button Sizes */}
              <View className="gap-2">
                <Text className="font-semibold">Sizes</Text>
                <View className="gap-2">
                  <Button size="sm"><Text>Small</Text></Button>
                  <Button size="default"><Text>Default</Text></Button>
                  <Button size="lg"><Text>Large</Text></Button>
                  <Button size="icon"><Text>🎯</Text></Button>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Avatar Component */}
        <Card>
          <CardHeader>
            <CardTitle>Avatar Component</CardTitle>
            <CardDescription>Avatar with image and fallback</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="flex-row gap-4 items-center">
              <Avatar alt="User JD">
                <AvatarFallback>
                  <Text>JD</Text>
                </AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12" alt="User AB">
                <AvatarFallback>
                  <Text>AB</Text>
                </AvatarFallback>
              </Avatar>
              <Avatar className="h-16 w-16" alt="User XY">
                <AvatarFallback>
                  <Text className="text-lg">XY</Text>
                </AvatarFallback>
              </Avatar>
            </View>
          </CardContent>
        </Card>

        {/* Progress Component */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Component</CardTitle>
            <CardDescription>Progress bars with different values</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text>25%</Text>
                  <Text className="text-muted-foreground">Loading...</Text>
                </View>
                <Progress value={25} />
              </View>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text>60%</Text>
                  <Text className="text-muted-foreground">In Progress</Text>
                </View>
                <Progress value={60} />
              </View>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text>100%</Text>
                  <Text className="text-muted-foreground">Complete</Text>
                </View>
                <Progress value={100} />
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Skeleton Component */}
        <Card>
          <CardHeader>
            <CardTitle>Skeleton Component</CardTitle>
            <CardDescription>Loading placeholders with animated shimmer effect</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-6">
              {/* Basic Skeletons */}
              <View className="gap-2">
                <Text className="font-semibold">Basic Shapes</Text>
                <View className="gap-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </View>
              </View>

              {/* Different Heights */}
              <View className="gap-2">
                <Text className="font-semibold">Different Heights</Text>
                <View className="gap-2">
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-12 w-full" />
                </View>
              </View>

              {/* Avatar Skeletons */}
              <View className="gap-2">
                <Text className="font-semibold">Avatar Placeholders</Text>
                <View className="flex-row gap-3 items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-16 w-16 rounded-full" />
                </View>
              </View>

              {/* Card Skeletons */}
              <View className="gap-2">
                <Text className="font-semibold">Card Placeholders</Text>
                <View className="gap-3">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </View>
              </View>

              {/* Button Skeletons */}
              <View className="gap-2">
                <Text className="font-semibold">Button Placeholders</Text>
                <View className="gap-2">
                  <Skeleton className="h-9 w-20 rounded" />
                  <Skeleton className="h-10 w-24 rounded" />
                  <Skeleton className="h-11 w-28 rounded" />
                  <Skeleton className="h-9 w-9 rounded" />
                </View>
              </View>

              {/* List Item Skeletons */}
              <View className="gap-2">
                <Text className="font-semibold">List Item Placeholders</Text>
                <View className="gap-4">
                  {/* User List Item */}
                  <View className="flex-row items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <View className="flex-1 gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </View>
                  </View>
                  
                  {/* Content List Item */}
                  <View className="gap-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </View>

                  {/* Product List Item */}
                  <View className="flex-row gap-3">
                    <Skeleton className="h-16 w-16 rounded" />
                    <View className="flex-1 gap-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-4 w-1/3" />
                    </View>
                  </View>
                </View>
              </View>

              {/* Complex Layout Skeleton */}
              <View className="gap-2">
                <Text className="font-semibold">Complex Layout</Text>
                <Card className="bg-muted/20">
                  <CardContent>
                    <View className="gap-4">
                      {/* Header */}
                      <View className="flex-row items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <View className="flex-1 gap-2">
                          <Skeleton className="h-5 w-2/3" />
                          <Skeleton className="h-3 w-1/2" />
                        </View>
                        <Skeleton className="h-8 w-16 rounded" />
                      </View>

                      {/* Content */}
                      <View className="gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </View>

                      {/* Image */}
                      <Skeleton className="h-48 w-full rounded-lg" />

                      {/* Actions */}
                      <View className="flex-row gap-2">
                        <Skeleton className="h-9 w-20 rounded" />
                        <Skeleton className="h-9 w-24 rounded" />
                        <Skeleton className="h-9 w-16 rounded" />
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </View>

              {/* Custom Colors */}
              <View className="gap-2">
                <Text className="font-semibold">Custom Colors</Text>
                <View className="gap-2">
                  <Skeleton className="h-4 w-full bg-primary/20" />
                  <Skeleton className="h-4 w-3/4 bg-destructive/20" />
                  <Skeleton className="h-4 w-1/2 bg-success/20" />
                  <Skeleton className="h-4 w-1/4 bg-accent/40" />
                </View>
              </View>

              {/* Different Border Radius */}
              <View className="gap-2">
                <Text className="font-semibold">Border Radius Variations</Text>
                <View className="gap-2">
                  <Skeleton className="h-6 w-full rounded-none" />
                  <Skeleton className="h-6 w-3/4 rounded-sm" />
                  <Skeleton className="h-6 w-1/2 rounded-md" />
                  <Skeleton className="h-6 w-1/4 rounded-lg" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Text Component */}
        <Card>
          <CardHeader>
            <CardTitle>Text Component</CardTitle>
            <CardDescription>Different text styles and colors</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-2">
              <Text className="text-foreground">Default foreground text</Text>
              <Text className="text-muted-foreground">Muted foreground text</Text>
              <Text className="text-primary">Primary colored text</Text>
              <Text className="text-secondary-foreground">Secondary foreground text</Text>
              <Text className="text-destructive">Destructive colored text</Text>
              <Text className="text-xs">Extra small text</Text>
              <Text className="text-sm">Small text</Text>
              <Text className="text-base">Base text</Text>
              <Text className="text-lg">Large text</Text>
              <Text className="text-xl">Extra large text</Text>
              <Text className="font-bold">Bold text</Text>
              <Text className="font-semibold">Semi-bold text</Text>
              <Text className="italic">Italic text</Text>
            </View>
          </CardContent>
        </Card>

        {/* Icon Component */}
        <Card>
          <CardHeader>
            <CardTitle>Icon Component</CardTitle>
            <CardDescription>Icons with className support using iconWithClassName helper</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              {/* Basic Icons */}
              <View className="gap-2">
                <Text className="font-semibold">Basic Icons (Pre-configured)</Text>
                <View className="flex-row gap-4 items-center">
                  <Info className="text-foreground" size={24} />
                  <MoonStar className="text-foreground" size={24} />
                  <Sun className="text-foreground" size={24} />
                </View>
              </View>

              {/* New Icons using iconWithClassName */}
              <View className="gap-2">
                <Text className="font-semibold">New Icons (Using iconWithClassName helper)</Text>
                <View className="flex-row gap-4 items-center">
                  <Heart className="text-destructive" size={24} />
                  <Settings className="text-muted-foreground" size={24} />
                </View>
              </View>

              {/* Icon Sizes */}
              <View className="gap-2">
                <Text className="font-semibold">Icon Sizes</Text>
                <View className="flex-row gap-4 items-center">
                  <Info className="text-primary" size={16} />
                  <Info className="text-primary" size={24} />
                  <Info className="text-primary" size={32} />
                  <Info className="text-primary" size={48} />
                </View>
              </View>

              {/* Icon Colors */}
              <View className="gap-2">
                <Text className="font-semibold">Icon Colors</Text>
                <View className="flex-row gap-4 items-center">
                  <Sun className="text-primary" size={24} />
                  <Sun className="text-secondary-foreground" size={24} />
                  <Sun className="text-destructive" size={24} />
                  <Sun className="text-muted-foreground" size={24} />
                  <Sun className="text-accent-foreground" size={24} />
                </View>
              </View>

              {/* Icons with Buttons */}
              <View className="gap-2">
                <Text className="font-semibold">Icons with Buttons</Text>
                <View className="gap-2">
                  <Button variant="default" className="flex-row gap-2">
                    <Info className="text-primary-foreground" size={16} />
                    <Text>Info Button</Text>
                  </Button>
                  <Button variant="outline" className="flex-row gap-2">
                    <MoonStar className="text-foreground" size={16} />
                    <Text>Dark Mode</Text>
                  </Button>
                  <Button variant="secondary" className="flex-row gap-2">
                    <Sun className="text-secondary-foreground" size={16} />
                    <Text>Light Mode</Text>
                  </Button>
                </View>
              </View>

              {/* Icon Opacity */}
              <View className="gap-2">
                <Text className="font-semibold">Icon Opacity</Text>
                <View className="flex-row gap-4 items-center">
                  <MoonStar className="text-foreground opacity-100" size={24} />
                  <MoonStar className="text-foreground opacity-75" size={24} />
                  <MoonStar className="text-foreground opacity-50" size={24} />
                  <MoonStar className="text-foreground opacity-25" size={24} />
                </View>
              </View>

              {/* Custom Icon Colors */}
              <View className="gap-2">
                <Text className="font-semibold">Custom Colors (Tailwind Palette)</Text>
                <View className="gap-3">
                  <View className="flex-row gap-4 items-center">
                    <Heart className="text-red-500" size={24} />
                    <Heart className="text-red-300" size={24} />
                    <Heart className="text-pink-500" size={24} />
                    <Heart className="text-rose-400" size={24} />
                  </View>
                  <View className="flex-row gap-4 items-center">
                    <Settings className="text-blue-500" size={24} />
                    <Settings className="text-blue-300" size={24} />
                    <Settings className="text-cyan-500" size={24} />
                    <Settings className="text-sky-400" size={24} />
                  </View>
                  <View className="flex-row gap-4 items-center">
                    <Sun className="text-yellow-500" size={24} />
                    <Sun className="text-orange-500" size={24} />
                    <Sun className="text-amber-400" size={24} />
                    <Sun className="text-lime-500" size={24} />
                  </View>
                  <View className="flex-row gap-4 items-center">
                    <Info className="text-green-500" size={24} />
                    <Info className="text-emerald-400" size={24} />
                    <Info className="text-teal-500" size={24} />
                    <Info className="text-purple-500" size={24} />
                  </View>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Tooltip Component */}
        <Card>
          <CardHeader>
            <CardTitle>Tooltip Component</CardTitle>
            <CardDescription>Interactive tooltips</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <Text>Hover for tooltip</Text>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <Text>This is a helpful tooltip!</Text>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary">
                    <Text>Another tooltip</Text>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <Text>More information here</Text>
                </TooltipContent>
              </Tooltip>
            </View>
          </CardContent>
        </Card>

        {/* RichContentRenderer Component */}
        <Card>
          <CardHeader>
            <CardTitle>RichContentRenderer Component</CardTitle>
            <CardDescription>Testing rich content rendering with JSON and fallbacks</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-6">
              {/* JSON Content Rendering */}
              <View className="gap-2">
                <Text className="font-semibold">JSON Content (ProseMirror Format)</Text>
                <Card className="bg-muted/50">
                  <CardContent className="p-0">
                    <RichContentRenderer 
                      jsonDescription={sampleJsonContent}
                      className="max-h-48"
                    />
                  </CardContent>
                </Card>
              </View>

              {/* Complex JSON with Advanced Features */}
              <View className="gap-2">
                <Text className="font-semibold">Advanced JSON Content</Text>
                <Text className="text-sm text-muted-foreground">
                  Demonstrating colored text, bold formatting, and various heading levels
                </Text>
                <Card className="bg-muted/50">
                  <CardContent className="p-0">
                    <RichContentRenderer 
                      jsonDescription={complexJsonContent}
                      className="max-h-56"
                    />
                  </CardContent>
                </Card>
              </View>

              {/* Plain Text Fallback */}
              <View className="gap-2">
                <Text className="font-semibold">Plain Text Fallback</Text>
                <Text className="text-sm text-muted-foreground">
                  When no JSON content is provided
                </Text>
                <Card className="bg-muted/50">
                  <CardContent className="p-0">
                    <RichContentRenderer 
                      fallbackDescription={plainTextContent}
                      className="max-h-32"
                    />
                  </CardContent>
                </Card>
              </View>

     

              {/* Empty Content */}
              <View className="gap-2">
                <Text className="font-semibold">Empty Content</Text>
                <Text className="text-sm text-muted-foreground">
                  No content provided at all
                </Text>
                <Card className="bg-muted/50">
                  <CardContent className="p-0">
                    <RichContentRenderer className="max-h-24" />
                  </CardContent>
                </Card>
              </View>

              {/* Different Height Constraints */}
              <View className="gap-2">
                <Text className="font-semibold">Different Height Constraints</Text>
                <Text className="text-sm text-muted-foreground">
                  Testing scrollability with constrained heights
                </Text>
                <View className="gap-3">
                  <View className="gap-1">
                    <Text className="text-xs font-medium">Small Height (max-h-20)</Text>
                    <Card className="bg-muted/50">
                      <CardContent className="p-0">
                        <RichContentRenderer 
                          jsonDescription={sampleJsonContent}
                          className="max-h-20"
                        />
                      </CardContent>
                    </Card>
                  </View>
                  <View className="gap-1">
                    <Text className="text-xs font-medium">Medium Height (max-h-32)</Text>
                    <Card className="bg-muted/50">
                      <CardContent className="p-0">
                        <RichContentRenderer 
                          jsonDescription={sampleJsonContent}
                          className="max-h-32"
                        />
                      </CardContent>
                    </Card>
                  </View>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Complex Card Example */}
        <Card>
          <CardHeader>
            <CardTitle>Complex Card Example</CardTitle>
            <CardDescription>Combining multiple components</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              <View className="flex-row items-center gap-3">
                <Avatar alt="User Name">
                  <AvatarFallback>
                    <Text>UN</Text>
                  </AvatarFallback>
                </Avatar>
                <View className="flex-1 gap-1">
                  <Text className="font-semibold">User Name</Text>
                  <Text className="text-sm text-muted-foreground">user@example.com</Text>
                </View>
              </View>
              
              <View className="gap-2">
                <Text className="font-medium">Project Progress</Text>
                <Progress value={75} />
                <Text className="text-sm text-muted-foreground">75% complete</Text>
              </View>
            </View>
          </CardContent>
          <CardFooter>
            <View className="flex-row gap-2">
              <Button variant="default" className="flex-1">
                <Text>Primary Action</Text>
              </Button>
              <Button variant="outline" className="flex-1">
                <Text>Secondary</Text>
              </Button>
            </View>
          </CardFooter>
        </Card>

        {/* Spacing at bottom */}
        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
