'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChromePicker } from 'react-color';
import { toast } from "sonner";
import { Copy, Link2, Code2, Frame, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';

interface SharePageProps {
  params: {
    portalId: string;
  };
}

export default function SharePage({ params }: SharePageProps) {
  const [primaryColor, setPrimaryColor] = useState('#007bff');
  const [delay, setDelay] = useState(2000);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [height, setHeight] = useState(600);
  const [width, setWidth] = useState('100%');
  const [formUrl, setFormUrl] = useState('');

  useEffect(() => {
    // Set the form URL only on the client side
    setFormUrl(`${window.location.origin}/${params.portalId}`);
  }, [params.portalId]);
  
  const embedScript = `<script>
(function(w,d,r){
    w[r] = w[r] || {};
    w[r].q = w[r].q || [];
    w[r].q.push(['init', {
        portalId: '${params.portalId}',
        primaryColor: '${primaryColor}',
        delay: ${delay}
    }]);
    const t = d.createElement('script');
    t.async = 1;
    t.src = 'https://l.makemorereviews.com/embed.js';
    const c = d.getElementsByTagName('script')[0];
    c.parentNode.insertBefore(t,c);
})(window, document, 'ReviewWidgetNS');</script>`;

  const iframeCode = `<iframe
  src="${formUrl}"
  width="${width}"
  height="${height}px"
  frameborder="0"
  style="border: none;"
></iframe>`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-4 md:py-8 px-4">
      <div className="flex flex-col space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="w-fit">
            <Link href={`/portal/${params.portalId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">Share Review Form</h1>
            <Separator orientation="vertical" className="hidden md:block h-8" />
            <p className="text-sm md:text-base text-muted-foreground">Choose how you want to integrate reviews into your website</p>
          </div>
        </div>
        
        <Tabs defaultValue="form" className="w-full">
          <TabsList className="w-full md:w-[400px] grid grid-cols-3">
            <TabsTrigger value="form" className="flex items-center gap-2 text-xs md:text-sm">
              <Link2 className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Link</span>
              <span className="md:hidden">Link</span>
            </TabsTrigger>
            <TabsTrigger value="widget" className="flex items-center gap-2 text-xs md:text-sm">
              <Code2 className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">Widget</span>
              <span className="md:hidden">Widget</span>
            </TabsTrigger>
            <TabsTrigger value="iframe" className="flex items-center gap-2 text-xs md:text-sm">
              <Frame className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden md:inline">iFrame</span>
              <span className="md:hidden">Frame</span>
            </TabsTrigger>
          </TabsList>

          {/* Form Link Tab */}
          <TabsContent value="form" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Share via Direct Link</CardTitle>
                <CardDescription className="text-sm">
                  Share this link with your customers to collect reviews. They can access the form directly
                  through their web browser.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <Label>Form URL</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={formUrl} className="text-sm" />
                    <Button onClick={() => copyToClipboard(formUrl)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Preview</CardTitle>
                <CardDescription className="text-sm">See how your review form looks to customers</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="border rounded-lg overflow-hidden">
                  {formUrl && (
                    <iframe
                      src={formUrl}
                      className="w-full h-[400px] md:h-[600px]"
                      title="Review Form Preview"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Widget Tab */}
          <TabsContent value="widget" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Embed as Widget</CardTitle>
                <CardDescription className="text-sm">
                  Add a floating review button to your website. When clicked, it opens a review form modal.
                  This is the most user-friendly option and recommended for most websites.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-md cursor-pointer border"
                        style={{ backgroundColor: primaryColor }}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 text-sm"
                      />
                    </div>
                    {showColorPicker && (
                      <div className="absolute z-10 mt-2">
                        <div
                          className="fixed inset-0"
                          onClick={() => setShowColorPicker(false)}
                        />
                        <ChromePicker
                          color={primaryColor}
                          onChange={(color) => setPrimaryColor(color.hex)}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Display Delay (ms)</Label>
                    <Input
                      type="number"
                      value={delay}
                      onChange={(e) => setDelay(Number(e.target.value))}
                      min="0"
                      step="1000"
                      className="text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Time to wait before showing the widget button
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Embed Code</Label>
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-muted font-mono text-xs md:text-sm overflow-x-auto">
                      {embedScript}
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(embedScript)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm md:text-base">Installation Instructions</h3>
                  <ol className="list-decimal list-inside space-y-1 text-xs md:text-sm text-muted-foreground">
                    <li>Copy the embed code above</li>
                    <li>Paste it just before the closing <code>&lt;/body&gt;</code> tag of your website</li>
                    <li>The widget button will appear after the specified delay</li>
                    <li>Customize the appearance using the options above</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* iFrame Tab */}
          <TabsContent value="iframe" className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">Embed as iFrame</CardTitle>
                <CardDescription className="text-sm">
                  Embed the review form directly into your website using an iFrame. This allows you to integrate
                  the form seamlessly into your existing layout.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Width</Label>
                    <Input
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="e.g., 100% or 500px"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (px)</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      min="200"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>iFrame Code</Label>
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-muted font-mono text-xs md:text-sm overflow-x-auto">
                      {iframeCode}
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(iframeCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  {formUrl && (
                    <iframe
                      src={formUrl}
                      width={width}
                      height={height}
                      style={{ border: 'none' }}
                      title="Review Form iFrame Preview"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
