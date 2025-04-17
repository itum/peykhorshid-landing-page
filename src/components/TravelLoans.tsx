import React from "react";

const TravelLoans = () => {
  return (
    <section id="travel-loans" className="py-6 md:py-8 lg:py-10 bg-gradient-to-b from-peyk-blue/10 to-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            چرا طرح جامع وام سفر پیک خورشید اهواز؟
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            به رویای سفرهای خود جامه عمل بپوشانید.
            بدون نیاز به ضامن یا چک، فقط با سفته الکترونیکی!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-2">
            <h3 className="font-bold text-xl md:text-2xl text-peyk-blue mb-3 md:mb-4">تورهای خارجی خاص</h3>
            <p className="text-base md:text-lg text-gray-600 mb-4">تا سقف ۱۰۰ میلیون تومان برای سفر به اروپا، آفریقا و آمریکای جنوبی</p>
            <div className="w-1/4 h-1 bg-peyk-blue rounded-full mt-auto"></div>
          </div>
          
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-2">
            <h3 className="font-bold text-xl md:text-2xl text-peyk-blue mb-3 md:mb-4">تورهای داخلی و خارجی عمومی</h3>
            <p className="text-base md:text-lg text-gray-600 mb-4">از ۲۰ تا ۸۰ میلیون تومان برای سفرهای داخلی و سایر تورهای خارجی</p>
            <div className="w-1/4 h-1 bg-peyk-blue rounded-full mt-auto"></div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8 md:mt-12">
          <a 
            href="#calculator" 
            className="bg-gradient-to-r from-peyk-orange to-peyk-orange-dark hover:from-peyk-orange-dark hover:to-peyk-orange text-white font-bold px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            مشاهده جزئیات
          </a>
        </div>
      </div>
    </section>
  );
};

export default TravelLoans;