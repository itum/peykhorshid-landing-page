import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Image as ImageIcon, Trash2 } from 'lucide-react';
import { uploadImage, deleteImage, listImages, ImageInfo } from '@/lib/services/uploadService';
import { toast } from 'sonner';
import ImageSizeInfo from './ImageSizeInfo';

interface HeroEditFormProps {
  item: any;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  onChange: (item: any) => void;
}

const HeroEditForm: React.FC<HeroEditFormProps> = ({
  item,
  onSave,
  onCancel,
  isSaving,
  onChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  // بارگذاری لیست تصاویر
  const loadImages = async () => {
    try {
      setLoadingImages(true);
      const imageList = await listImages();
      setImages(imageList);
    } catch (error) {
      console.error('Error loading images:', error);
      toast.error('خطا در بارگذاری تصاویر');
    } finally {
      setLoadingImages(false);
    }
  };

  // آپلود تصویر
  const handleImageUpload = async (file: File, type: 'desktop' | 'mobile') => {
    try {
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

      setUploading(true);
      const uploadedImage = await uploadImage(file);
      
      onChange({
        ...item,
        data: {
          ...item.data,
          [type]: {
            ...item.data?.[type],
            url: uploadedImage.url,
            filename: uploadedImage.filename,
            originalName: uploadedImage.originalName
          }
        }
      });
      
      toast.success('تصویر با موفقیت آپلود شد');
      await loadImages(); // بارگذاری مجدد لیست تصاویر
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('خطا در آپلود تصویر');
    } finally {
      setUploading(false);
    }
  };

  // حذف تصویر
  const handleImageDelete = async (filename: string) => {
    try {
      await deleteImage(filename);
      toast.success('تصویر حذف شد');
      await loadImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('خطا در حذف تصویر');
    }
  };

  // انتخاب فایل
  const handleFileSelect = (type: 'desktop' | 'mobile') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png,.jpg,.jpeg,.gif,.webp,.svg';
    input.style.display = 'none';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(file, type);
      }
    };
    
    input.click();
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(null);
  };

  const handleDrop = async (e: React.DragEvent, type: 'desktop' | 'mobile') => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile, type);
    } else {
      toast.error('لطفاً یک فایل تصویری انتخاب کنید');
    }
  };

  // انتخاب تصویر از گالری
  const selectImageFromGallery = (imageUrl: string, type: 'desktop' | 'mobile') => {
    onChange({
      ...item,
      data: {
        ...item.data,
        [type]: {
          ...item.data?.[type],
          url: imageUrl,
          filename: imageUrl.split('/').pop()
        }
      }
    });
  };

  React.useEffect(() => {
    loadImages();
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content">محتوا</TabsTrigger>
          <TabsTrigger value="images">تصاویر</TabsTrigger>
          <TabsTrigger value="desktop">دسکتاپ</TabsTrigger>
          <TabsTrigger value="mobile">موبایل</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>محتوای Hero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان اصلی</Label>
                <Input
                  id="title"
                  value={item.data?.title || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      title: e.target.value
                    }
                  })}
                  placeholder="سفر، ارزان‌تر از پیتزا!"
                />
              </div>
              
              <div>
                <Label htmlFor="subtitle">زیرعنوان</Label>
                <Input
                  id="subtitle"
                  value={item.data?.subtitle || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      subtitle: e.target.value
                    }
                  })}
                  placeholder="با پیک خورشید"
                />
              </div>
              
              <div>
                <Label htmlFor="description">توضیحات</Label>
                <Textarea
                  id="description"
                  value={item.data?.description || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      description: e.target.value
                    }
                  })}
                  placeholder="سامانه خرید اقساطی آنلاین و چک صیادی..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-button-text">متن دکمه اصلی</Label>
                  <Input
                    id="primary-button-text"
                    value={item.data?.primary_button_text || ''}
                    onChange={(e) => onChange({
                      ...item,
                      data: {
                        ...item.data,
                        primary_button_text: e.target.value
                      }
                    })}
                    placeholder="شروع سفر"
                  />
                </div>
                <div>
                  <Label htmlFor="secondary-button-text">متن دکمه ثانویه</Label>
                  <Input
                    id="secondary-button-text"
                    value={item.data?.secondary_button_text || ''}
                    onChange={(e) => onChange({
                      ...item,
                      data: {
                        ...item.data,
                        secondary_button_text: e.target.value
                      }
                    })}
                    placeholder="مشاهده تورها"
                  />
                </div>
              </div>

              <div>
                <Label>آمار و اعداد</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="stat1-number">تعداد مسافر</Label>
                    <Input
                      id="stat1-number"
                      value={item.data?.stats?.passengers || ''}
                      onChange={(e) => onChange({
                        ...item,
                        data: {
                          ...item.data,
                          stats: { ...item.data?.stats, passengers: e.target.value }
                        }
                      })}
                      placeholder="50K+"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stat1-label">برچسب مسافر</Label>
                    <Input
                      id="stat1-label"
                      value={item.data?.stats?.passengers_label || ''}
                      onChange={(e) => onChange({
                        ...item,
                        data: {
                          ...item.data,
                          stats: { ...item.data?.stats, passengers_label: e.target.value }
                        }
                      })}
                      placeholder="مسافر راضی"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stat2-number">تعداد مقصد</Label>
                    <Input
                      id="stat2-number"
                      value={item.data?.stats?.destinations || ''}
                      onChange={(e) => onChange({
                        ...item,
                        data: {
                          ...item.data,
                          stats: { ...item.data?.stats, destinations: e.target.value }
                        }
                      })}
                      placeholder="100+"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stat2-label">برچسب مقصد</Label>
                    <Input
                      id="stat2-label"
                      value={item.data?.stats?.destinations_label || ''}
                      onChange={(e) => onChange({
                        ...item,
                        data: {
                          ...item.data,
                          stats: { ...item.data?.stats, destinations_label: e.target.value }
                        }
                      })}
                      placeholder="مقصد مختلف"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>گالری تصاویر</CardTitle>
            </CardHeader>
            <CardContent>
              {/* اطلاعات سایز پیشنهادی */}
              <div className="mb-4 space-y-2">
                <ImageSizeInfo 
                  recommendedSize="1920x1080px" 
                  description="سایز پیشنهادی دسکتاپ"
                />
                <ImageSizeInfo 
                  recommendedSize="1080x1920px" 
                  description="سایز پیشنهادی موبایل"
                />
              </div>

              <div className="mb-4">
                <Button
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.png,.jpg,.jpeg,.gif,.webp,.svg';
                    input.style.display = 'none';
                    
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        try {
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

                          setUploading(true);
                          await uploadImage(file);
                          toast.success('تصویر با موفقیت آپلود شد');
                          await loadImages(); // بارگذاری مجدد لیست تصاویر
                        } catch (error) {
                          console.error('Error uploading image:', error);
                          toast.error('خطا در آپلود تصویر');
                        } finally {
                          setUploading(false);
                        }
                      }
                    };
                    
                    input.click();
                  }}
                  disabled={uploading}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 ml-2" />
                  {uploading ? 'در حال آپلود...' : 'آپلود تصویر جدید'}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  PNG, JPG, JPEG, GIF, WEBP, SVG (حداکثر 10MB)
                </p>
              </div>

              {loadingImages ? (
                <div className="text-center py-4">در حال بارگذاری...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.filename} className="relative group">
                      <img
                        src={image.url}
                        alt={image.filename}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="flex space-x-2 space-x-reverse">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => selectImageFromGallery(image.url, 'desktop')}
                          >
                            دسکتاپ
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => selectImageFromGallery(image.url, 'mobile')}
                          >
                            موبایل
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleImageDelete(image.filename)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="desktop" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تصویر دسکتاپ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-4">
                <ImageSizeInfo 
                  recommendedSize="1920x1080px" 
                  description="سایز پیشنهادی تصویر دسکتاپ"
                />
              </div>
              <div>
                <Label>تصویر فعلی</Label>
                {item.data?.desktop?.url ? (
                  <div className="mt-2">
                    <img
                      src={item.data.desktop.url}
                      alt="Desktop hero"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="mt-2 flex space-x-2 space-x-reverse">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFileSelect('desktop')}
                        disabled={uploading}
                      >
                        <Upload className="h-4 w-4 ml-2" />
                        تغییر تصویر
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onChange({
                          ...item,
                          data: {
                            ...item.data,
                            desktop: { ...item.data?.desktop, url: '', filename: '' }
                          }
                        })}
                      >
                        <X className="h-4 w-4 ml-2" />
                        حذف
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragOver === 'desktop' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={(e) => handleDragOver(e, 'desktop')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'desktop')}
                  >
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">هیچ تصویری انتخاب نشده</p>
                    <p className="text-sm text-gray-400 mb-4">تصویر را اینجا بکشید یا کلیک کنید</p>
                    <Button
                      onClick={() => handleFileSelect('desktop')}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4 ml-2" />
                      {uploading ? 'در حال آپلود...' : 'انتخاب تصویر'}
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="desktop-alt">متن جایگزین</Label>
                <Input
                  id="desktop-alt"
                  value={item.data?.desktop?.alt || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      desktop: { ...item.data?.desktop, alt: e.target.value }
                    }
                  })}
                  placeholder="تصویر پس‌زمینه دسکتاپ"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>تصویر موبایل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* اطلاعات سایز پیشنهادی */}
              <ImageSizeInfo 
                recommendedSize="1080x1920px" 
                description="سایز پیشنهادی تصویر موبایل"
                className="mb-4"
              />
              <div>
                <Label>تصویر فعلی</Label>
                {item.data?.mobile?.url ? (
                  <div className="mt-2">
                    <img
                      src={item.data.mobile.url}
                      alt="Mobile hero"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <div className="mt-2 flex space-x-2 space-x-reverse">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFileSelect('mobile')}
                        disabled={uploading}
                      >
                        <Upload className="h-4 w-4 ml-2" />
                        تغییر تصویر
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onChange({
                          ...item,
                          data: {
                            ...item.data,
                            mobile: { ...item.data?.mobile, url: '', filename: '' }
                          }
                        })}
                      >
                        <X className="h-4 w-4 ml-2" />
                        حذف
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragOver === 'mobile' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={(e) => handleDragOver(e, 'mobile')}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, 'mobile')}
                  >
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">هیچ تصویری انتخاب نشده</p>
                    <p className="text-sm text-gray-400 mb-4">تصویر را اینجا بکشید یا کلیک کنید</p>
                    <Button
                      onClick={() => handleFileSelect('mobile')}
                      disabled={uploading}
                    >
                      <Upload className="h-4 w-4 ml-2" />
                      {uploading ? 'در حال آپلود...' : 'انتخاب تصویر'}
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="mobile-alt">متن جایگزین</Label>
                <Input
                  id="mobile-alt"
                  value={item.data?.mobile?.alt || ''}
                  onChange={(e) => onChange({
                    ...item,
                    data: {
                      ...item.data,
                      mobile: { ...item.data?.mobile, alt: e.target.value }
                    }
                  })}
                  placeholder="تصویر پس‌زمینه موبایل"
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
        <Button onClick={onSave} disabled={isSaving || uploading}>
          {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
        </Button>
      </div>
    </div>
  );
};

export default HeroEditForm;