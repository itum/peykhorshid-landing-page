import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage, deleteImage, listImages, ImageInfo } from '@/lib/services/uploadService';
import { toast } from 'sonner';
import ImageSizeInfo from './ImageSizeInfo';

interface NavbarEditFormProps {
  item: any;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  onChange: (item: any) => void;
}

const NavbarEditForm: React.FC<NavbarEditFormProps> = ({
  item,
  onSave,
  onCancel,
  isSaving,
  onChange
}) => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // بارگذاری تصاویر موجود
  React.useEffect(() => {
    const loadImages = async () => {
      try {
        const imageList = await listImages();
        setImages(imageList);
      } catch (error) {
        console.error('خطا در بارگذاری تصاویر:', error);
      }
    };
    loadImages();
  }, []);

  // آپلود تصویر
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    // بررسی نوع فایل
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('فقط فایل‌های تصویری (PNG, JPG, JPEG, GIF, WEBP, SVG) مجاز هستند');
      return;
    }
    
    // بررسی سایز فایل (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('سایز فایل نباید بیشتر از 10MB باشد');
      return;
    }
    
    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      const newImage: ImageInfo = {
        filename: result.filename,
        url: result.url,
        size: result.size,
        mimetype: result.mimetype
      };
      
      setImages(prev => [newImage, ...prev]);
      toast.success('تصویر با موفقیت آپلود شد');
    } catch (error) {
      console.error('خطا در آپلود تصویر:', error);
      toast.error('خطا در آپلود تصویر');
    } finally {
      setIsUploading(false);
    }
  };

  // حذف تصویر
  const handleDeleteImage = async (filename: string) => {
    try {
      await deleteImage(filename);
      setImages(prev => prev.filter(img => img.filename !== img));
      toast.success('تصویر حذف شد');
    } catch (error) {
      console.error('خطا در حذف تصویر:', error);
      toast.error('خطا در حذف تصویر');
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile);
    } else {
      toast.error('لطفاً یک فایل تصویری انتخاب کنید');
    }
  };

  // انتخاب تصویر از گالری
  const handleSelectImage = (imageUrl: string) => {
    onChange({
      ...item,
      data: {
        ...item.data,
        logo: {
          ...item.data?.logo,
          url: imageUrl
        }
      }
    });
    setShowImageGallery(false);
  };

  const handleAddNavItem = () => {
    const newItem = { id: '', label: '', url: '' };
    const updatedItems = [...(item.data?.navigation_items || []), newItem];
    onChange({
      ...item,
      data: {
        ...item.data,
        navigation_items: updatedItems
      }
    });
  };

  const handleRemoveNavItem = (index: number) => {
    const updatedItems = item.data?.navigation_items?.filter((_: any, i: number) => i !== index) || [];
    onChange({
      ...item,
      data: {
        ...item.data,
        navigation_items: updatedItems
      }
    });
  };

  const handleNavItemChange = (index: number, field: string, value: string) => {
    const updatedItems = [...(item.data?.navigation_items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    onChange({
      ...item,
      data: {
        ...item.data,
        navigation_items: updatedItems
      }
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">عمومی</TabsTrigger>
          <TabsTrigger value="logo">لوگو</TabsTrigger>
          <TabsTrigger value="navigation">منو</TabsTrigger>
          <TabsTrigger value="styling">استایل</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات عمومی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان</Label>
                <Input
                  id="title"
                  value={item.title || ''}
                  onChange={(e) => onChange({ ...item, title: e.target.value })}
                  placeholder="عنوان هدر"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات لوگو</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* اطلاعات سایز پیشنهادی */}
              <ImageSizeInfo 
                recommendedSize="150x80px" 
                description="سایز پیشنهادی لوگو"
                className="mb-4"
              />
              
              {/* آپلود تصویر */}
              <div className="space-y-4">
                <Label>آپلود تصویر لوگو</Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.gif,.webp,.svg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="hidden"
                    id="logo-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {isUploading ? 'در حال آپلود...' : 'کلیک کنید یا فایل را بکشید'}
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, JPEG, GIF, WEBP, SVG (حداکثر 10MB)
                    </span>
                  </label>
                </div>
                
                {/* دکمه انتخاب از گالری */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowImageGallery(true)}
                  className="w-full"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  انتخاب از گالری
                </Button>
              </div>

              {/* نمایش تصویر فعلی */}
              {item.data?.logo?.url && (
                <div className="space-y-2">
                  <Label>تصویر فعلی</Label>
                  <div className="relative inline-block">
                    <img
                      src={item.data.logo.url}
                      alt={item.data.logo.alt || 'لوگو'}
                      className="max-w-32 max-h-16 object-contain border rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                      onClick={() => onChange({
                        ...item,
                        data: {
                          ...item.data,
                          logo: { ...item.data?.logo, url: '' }
                        }
                      })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="logo-url">آدرس تصویر لوگو</Label>
                <Input
                  id="logo-url"
                  value={item.data?.logo?.url || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      logo: { ...item.data?.logo, url: e.target.value }
                    }
                  })}
                  placeholder="/peykhorshid-logo.png"
                />
              </div>
              <div>
                <Label htmlFor="logo-alt">متن جایگزین</Label>
                <Input
                  id="logo-alt"
                  value={item.data?.logo?.alt || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      logo: { ...item.data?.logo, alt: e.target.value }
                    }
                  })}
                  placeholder="پیک خورشید اهواز"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo-width">عرض (px)</Label>
                  <Input
                    id="logo-width"
                    type="number"
                    value={item.data?.logo?.width || 150}
                    onChange={(e) => onChange({
                      ...item,
                      data: {
                        ...item.data,
                        logo: { ...item.data?.logo, width: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="logo-height">ارتفاع (px)</Label>
                  <Input
                    id="logo-height"
                    type="number"
                    value={item.data?.logo?.height || 80}
                    onChange={(e) => onChange({
                      ...item,
                      data: {
                        ...item.data,
                        logo: { ...item.data?.logo, height: parseInt(e.target.value) }
                      }
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>منوی ناوبری</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {(item.data?.navigation_items || []).map((navItem: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">آیتم {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveNavItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`nav-id-${index}`}>شناسه</Label>
                        <Input
                          id={`nav-id-${index}`}
                          value={navItem.id || ''}
                          onChange={(e) => handleNavItemChange(index, 'id', e.target.value)}
                          placeholder="hero"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`nav-label-${index}`}>برچسب</Label>
                        <Input
                          id={`nav-label-${index}`}
                          value={navItem.label || ''}
                          onChange={(e) => handleNavItemChange(index, 'label', e.target.value)}
                          placeholder="صفحه اصلی"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddNavItem}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  افزودن آیتم منو
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="styling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تنظیمات استایل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bg-color">رنگ پس‌زمینه</Label>
                  <Input
                    id="bg-color"
                    value={item.data?.background_color || ''}
                    onChange={(e) => onChange({
                      ...item,
                      data: {
                        ...item.data,
                        background_color: e.target.value
                      }
                    })}
                    placeholder="bg-white/90"
                  />
                </div>
                <div>
                  <Label htmlFor="text-color">رنگ متن</Label>
                  <Input
                    id="text-color"
                    value={item.data?.text_color || ''}
                    onChange={(e) => onChange({
                      ...item,
                      data: {
                        ...item.data,
                        text_color: e.target.value
                      }
                    })}
                    placeholder="text-gray-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="active-color">رنگ فعال</Label>
                  <Input
                    id="active-color"
                    value={item.data?.active_color || ''}
                    onChange={(e) => onChange({
                      ...item,
                      data: {
                        ...item.data,
                        active_color: e.target.value
                      }
                    })}
                    placeholder="text-peyk-orange"
                  />
                </div>
                <div>
                  <Label htmlFor="hover-color">رنگ هاور</Label>
                  <Input
                    id="hover-color"
                    value={item.data?.hover_color || ''}
                    onChange={(e) => onChange({
                      ...item,
                      data: {
                        ...item.data,
                        hover_color: e.target.value
                      }
                    })}
                    placeholder="hover:text-peyk-orange"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="underline-color">رنگ خط زیر</Label>
                <Input
                  id="underline-color"
                  value={item.data?.underline_color || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      underline_color: e.target.value
                    }
                  })}
                  placeholder="bg-peyk-orange"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 space-x-reverse">
        <Button variant="outline" onClick={onCancel}>
          انصراف
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
        </Button>
      </div>

      {/* گالری تصاویر */}
      {showImageGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">انتخاب تصویر از گالری</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImageGallery(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.filename} className="relative group">
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => handleSelectImage(image.url)}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteImage(image.filename)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {image.filename}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                تصویری در گالری موجود نیست
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarEditForm;
