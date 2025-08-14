import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  CloudUpload, 
  Eye, 
  Sparkles, 
  Download, 
  Plus, 
  Brain,
  FlipHorizontal2,
  Rocket,
  Loader2
} from "lucide-react";

interface AnalysisResult {
  id: string;
  original: {
    description: string;
    elements: string[];
    mood: string;
  };
  mirror: {
    description: string;
    elements: string[];
    mood: string;
  };
}

export default function Home() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiRequest('POST', '/api/analyze-image', formData);
      return await response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: "Your image has been analyzed from both perspectives!",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image under 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const startAnalysis = () => {
    if (selectedFile) {
      analyzeMutation.mutate(selectedFile);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };



  const downloadResults = () => {
    if (analysis) {
      const data = {
        original: analysis.original,
        mirror: analysis.mirror,
        timestamp: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mirror-vision-analysis.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-apple-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-semibold text-foreground">InverseLens</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Discover Two Perspectives
          </h2>
          <p className="text-lg text-apple-gray max-w-2xl mx-auto leading-relaxed">
            Upload an image and witness AI analyze it from both reality and its mirror universe—revealing 
            two completely different interpretations of the same visual story.
          </p>
        </section>

        {/* Upload Section */}
        <section className="mb-12">
          <Card className={`p-8 md:p-12 transition-all duration-300 border-2 ${
            dragActive 
              ? 'border-apple-blue bg-apple-blue/5' 
              : 'border-apple-border hover:border-apple-blue/50'
          }`}>
            <div
              className="text-center cursor-pointer"
              data-testid="upload-zone"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !selectedFile && !analyzeMutation.isPending && document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                data-testid="input-file"
              />
              
              {/* Loading State */}
              {analyzeMutation.isPending && (
                <div data-testid="upload-loading">
                  <div className="w-12 h-12 mx-auto mb-4">
                    <Loader2 className="w-12 h-12 text-apple-blue animate-spin" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Analyzing image...
                  </h3>
                  <p className="text-apple-gray">
                    Our AI is examining your image from multiple dimensions
                  </p>
                </div>
              )}

              {/* Preview State */}
              {selectedFile && previewUrl && !analyzeMutation.isPending && !analysis && (
                <div data-testid="upload-preview">
                  <div className="relative inline-block mb-6">
                    <img 
                      src={previewUrl} 
                      alt="Uploaded preview" 
                      className="rounded-xl shadow-apple max-w-xs max-h-48 object-cover"
                      data-testid="img-preview"
                    />
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={startAnalysis}
                      className="bg-apple-blue hover:bg-apple-blue/90"
                      data-testid="button-analyze"
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Analyze Image
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetUpload}
                      data-testid="button-reset"
                    >
                      Upload Different Image
                    </Button>
                  </div>
                </div>
              )}

              {/* Default Upload State */}
              {!selectedFile && !analyzeMutation.isPending && (
                <div data-testid="upload-default">
                  <div className="w-16 h-16 bg-apple-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CloudUpload className="text-apple-blue text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Drop your image here
                  </h3>
                  <p className="text-apple-gray mb-6">
                    or click to browse from your device
                  </p>
                  <Button className="bg-apple-blue hover:bg-apple-blue/90" data-testid="button-choose">
                    Choose Image
                  </Button>
                  <p className="text-sm text-apple-gray mt-4">
                    Supports JPG, PNG, WebP up to 10MB
                  </p>
                </div>
              )}
            </div>
          </Card>
        </section>

        {/* Results Section */}
        {analysis && (
          <section data-testid="results-section" className="mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Original Analysis */}
              <Card className="p-8 shadow-apple-lg border border-apple-border">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-apple-success/10 rounded-full flex items-center justify-center mr-4">
                    <Eye className="text-apple-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Reality Analysis</h3>
                    <p className="text-sm text-apple-gray">What the image actually shows</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-apple-light rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-2">Visual Description</h4>
                    <p className="text-apple-gray leading-relaxed" data-testid="text-original-description">
                      {analysis.original.description}
                    </p>
                  </div>
                  
                  <div className="bg-apple-light rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-2">Key Elements</h4>
                    <div className="flex flex-wrap gap-2" data-testid="elements-original">
                      {analysis.original.elements.map((element, index) => (
                        <Badge key={index} className="bg-apple-blue/10 text-apple-blue border border-apple-blue/20 hover:bg-apple-blue/20">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-apple-light rounded-xl p-4">
                    <h4 className="font-medium text-foreground mb-2">Mood & Atmosphere</h4>
                    <p className="text-apple-gray" data-testid="text-original-mood">
                      {analysis.original.mood}
                    </p>
                  </div>
                </div>
              </Card>

              {/* FlipHorizontal2 Universe Analysis */}
              <Card className="p-8 shadow-apple-lg border border-apple-border">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-apple-purple/10 rounded-full flex items-center justify-center mr-4">
                    <Sparkles className="text-apple-purple" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Inverse Universe</h3>
                    <p className="text-sm text-apple-gray">The opposite interpretation</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                    <h4 className="font-medium text-foreground mb-2">Reversed Description</h4>
                    <p className="text-apple-gray leading-relaxed" data-testid="text-mirror-description">
                      {analysis.mirror.description}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                    <h4 className="font-medium text-foreground mb-2">Inverted Elements</h4>
                    <div className="flex flex-wrap gap-2" data-testid="elements-mirror">
                      {analysis.mirror.elements.map((element, index) => (
                        <Badge key={index} className="bg-apple-purple/10 text-apple-purple border border-apple-purple/20 hover:bg-apple-purple/20 dark:bg-apple-purple/20 dark:text-apple-purple dark:border-apple-purple/30">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                    <h4 className="font-medium text-foreground mb-2">Opposite Mood</h4>
                    <p className="text-apple-gray" data-testid="text-mirror-mood">
                      {analysis.mirror.mood}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Display Uploaded Image */}
            {previewUrl && (
              <div className="mt-12 text-center">
                <h3 className="text-xl font-semibold text-foreground mb-6">Your Original Image</h3>
                <div className="relative inline-block">
                  <img 
                    src={previewUrl} 
                    alt="Original uploaded image" 
                    className="rounded-xl shadow-apple-lg max-w-full max-h-96 object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              <Button 
                onClick={downloadResults} 
                className="bg-apple-blue hover:bg-apple-blue/90"
                data-testid="button-download"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Analysis
              </Button>

              <Button 
                variant="outline" 
                onClick={resetUpload}
                data-testid="button-new"
              >
                <Plus className="mr-2 h-4 w-4" />
                Analyze New Image
              </Button>
            </div>
          </section>
        )}

        {/* Feature Highlights - Only show when no analysis results */}
        {!analysis && (
          <section className="mt-12 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Powered by Advanced AI
            </h2>
            <p className="text-apple-gray max-w-2xl mx-auto">
              Our cutting-edge technology doesn't just see—it imagines, creating fascinating alternative interpretations of reality.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-apple-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="text-apple-blue text-xl" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Deep Analysis</h3>
              <p className="text-apple-gray text-sm">
                Advanced computer vision identifies objects, scenes, and emotions with remarkable accuracy.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-apple-purple/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FlipHorizontal2 className="text-apple-purple text-xl" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Inverse Logic</h3>
              <p className="text-apple-gray text-sm">
                Proprietary algorithms create meaningful opposite interpretations that spark creativity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-apple-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="text-apple-success text-xl" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
              <p className="text-apple-gray text-sm">
                Get both analyses in seconds, optimized for real-time creative workflows.
              </p>
            </div>
          </div>
        </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-apple-light border-t border-apple-border mt-12">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <span className="text-apple-gray text-sm">© 2025 InverseLens</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
