'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChromePicker } from 'react-color';
import { toast, Toaster } from "sonner";

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

  const formUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${params.portalId}`;
  
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
    <div className="container mx-auto py-8 px-4">
      <Toaster position="bottom-right" />
      <h1 className="text-3xl font-bold mb-8">Share Review Form</h1>
      
      <Tabs defaultValue="form" className="w-full">
        <TabsList className="grid w-full grid-cols-3 p-1 bg-muted rounded-2xl mb-6">
          <TabsTrigger value="form" className="rounded-xl py-2">Form Link</TabsTrigger>
          <TabsTrigger value="widget" className="rounded-xl py-2">Widget</TabsTrigger>
          <TabsTrigger value="iframe" className="rounded-xl py-2">iFrame</TabsTrigger>
        </TabsList>

        {/* Form Link Tab */}
        <TabsContent value="form" className="space-y-6">
          <div className="prose max-w-none">
            <h2>Share via Direct Link</h2>
            <p>
              Share this link with your customers to collect reviews. They can access the form directly
              through their web browser.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <label className="block text-base font-medium mb-3">Form URL</label>
            <div className="space-y-4">
              <input
                type="text"
                readOnly
                value={formUrl}
                className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-base"
              />
              <button
                onClick={() => copyToClipboard(formUrl)}
                className="w-full py-4 text-base font-medium rounded-2xl border border-gray-200 hover:bg-gray-50"
              >
                Copy Link
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="border rounded-2xl overflow-hidden">
              <iframe
                src={formUrl}
                className="w-full h-[600px]"
                title="Review Form Preview"
              />
            </div>
          </div>
        </TabsContent>

        {/* Widget Tab */}
        <TabsContent value="widget" className="space-y-6">
          <div className="prose max-w-none">
            <h2>Embed as Widget</h2>
            <p>
              Add a floating review button to your website. When clicked, it opens a review form modal.
              This is the most user-friendly option and recommended for most websites.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <div>
              <label className="block text-base font-medium mb-3">Primary Color</label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 p-4 bg-white border border-gray-200 rounded-2xl text-base"
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

            <div>
              <label className="block text-base font-medium mb-3">Display Delay (ms)</label>
              <input
                type="number"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-base"
                min="0"
                step="1000"
              />
              <p className="mt-2 text-sm text-gray-600">
                Time to wait before showing the widget button (in milliseconds)
              </p>
            </div>

            <div>
              <label className="block text-base font-medium mb-3">Embed Code</label>
              <div className="relative">
                <div className="rounded-[20px] border border-gray-200 bg-white">
                  <div className="overflow-x-auto" style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#CBD5E1 transparent',
                  }}>
                    <pre className="p-6 text-sm font-mono" style={{ 
                      whiteSpace: 'pre',
                      display: 'inline-block',
                      minWidth: '100%'
                    }}>
{embedScript}</pre>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(embedScript)}
                  className="absolute top-4 right-4 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white px-4 py-2 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3>Installation Instructions</h3>
            <ol>
              <li>Copy the embed code above</li>
              <li>Paste it just before the closing <code>&lt;/body&gt;</code> tag of your website</li>
              <li>The widget button will appear after the specified delay</li>
              <li>Customize the appearance using the options above</li>
            </ol>
          </div>
        </TabsContent>

        {/* iFrame Tab */}
        <TabsContent value="iframe" className="space-y-6">
          <div className="prose max-w-none">
            <h2>Embed as iFrame</h2>
            <p>
              Embed the review form directly into your webpage. This allows you to place the form
              anywhere on your site and customize its dimensions.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium mb-3">Width</label>
                <input
                  type="text"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-base"
                  placeholder="e.g., 100%, 500px"
                />
              </div>
              <div>
                <label className="block text-base font-medium mb-3">Height (px)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-base"
                  min="200"
                  step="50"
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-medium mb-3">iFrame Code</label>
              <div className="relative">
                <div className="rounded-[20px] border border-gray-200 bg-white">
                  <div className="overflow-x-auto" style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#CBD5E1 transparent',
                  }}>
                    <pre className="p-6 text-sm font-mono" style={{ 
                      whiteSpace: 'pre',
                      display: 'inline-block',
                      minWidth: '100%'
                    }}>
{iframeCode}</pre>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(iframeCode)}
                  className="absolute top-4 right-4 rounded-xl bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white px-4 py-2 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3>Installation Instructions</h3>
            <ol>
              <li>Adjust the width and height to fit your webpage layout</li>
              <li>Copy the iFrame code</li>
              <li>Paste it where you want the form to appear on your webpage</li>
              <li>The form will be embedded directly in your page</li>
            </ol>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
