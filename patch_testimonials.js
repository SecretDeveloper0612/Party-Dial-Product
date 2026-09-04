const fs = require('fs');
const file = 'client/src/app/(user-portal)/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `{/* Style to force linear smooth scrolling for Swiper */}
        <style dangerouslySetInnerHTML={{
          __html: \`
          .testimonials-swiper .swiper-wrapper {
            transition-timing-function: linear !important;
          }
        \`}} />

        {/* Marquee Container with Gradient Mask */}
        <div className="relative flex flex-col overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pb-10 gap-6 md:gap-8">

          {/* Row 1 - Scrolling Left */}
          <div className="w-full">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={32}
              slidesPerView="auto"
              loop={true}
              speed={6000}
              allowTouchMove={false}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              className="testimonials-swiper"
            >
              {[
                { name: "Rahul Malhotra", text: "PartyDial made our wedding planning so much easier! We received 5 quotes within 2 hours and booked a beautiful palace.", avatar: "https://randomuser.me/api/portraits/men/18.jpg" },
                { name: "Sneha Kapoor", text: "As a corporate event planner, I need quick responses. PartyDial delivered! Found an amazing rooftop venue for our team's meet.", avatar: "https://randomuser.me/api/portraits/women/20.jpg" },
                { name: "Amit Verma", text: "Found the perfect banquet hall for my son's 1st birthday. The zero brokerage promise is real – we saved a lot!", avatar: "https://randomuser.me/api/portraits/men/24.jpg" },
                { name: "Priya Sharma", text: "The aesthetic of the venues I found through PartyDial was incredible. Perfect for my content and within budget!", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
                { name: "Vikram Singh", text: "Professional service and transparent pricing. No hidden costs. Best platform for premium venue discovery.", avatar: "https://randomuser.me/api/portraits/men/63.jpg" }
              ].map((t, i) => (
                <SwiperSlide key={i} className="!w-[320px] md:!w-[420px]">`;

const target2 = `                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Row 2 - Scrolling Right */}
          <div className="w-full">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={32}
              slidesPerView="auto"
              loop={true}
              speed={6000}
              allowTouchMove={false}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                reverseDirection: true
              }}
              className="testimonials-swiper"
            >
              {[
                { name: "Neha Gupta", role: "Anniversary Celebration", text: "Booked a resort for our 10th anniversary. The options provided were exactly what we had in mind. Flawless experience!", avatar: "6" },
                { name: "Karan Desai", role: "Event Organizer", text: "I regularly use PartyDial for my clients. The interface is smooth, and the venues listed are verified. It saves me days of research.", avatar: "7" },
                { name: "Anjali Rao", role: "Pre-Wedding Shoot", text: "Finding an aesthetic venue for our shoot was tough until we used PartyDial. Directly connected with the owner and booked it!", avatar: "8" },
                { name: "Sameer Khan", role: "Startup Founder", text: "Hosted our product launch party at a venue found here. The direct pricing feature helped us stay well within our bootstrap budget.", avatar: "9" },
                { name: "Pooja Mehta", role: "Baby Shower", text: "Everything from finding the venue to booking was completely hassle-free. Absolutely highly recommend PartyDial to anyone!", avatar: "10" }
              ].map((t, i) => (
                <SwiperSlide key={i} className="!w-[320px] md:!w-[420px]">`;

const target3 = `                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>`;

const rep1 = `{/* Style to force linear smooth scrolling for CSS Marquee */}
        <style dangerouslySetInnerHTML={{
          __html: \`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee-reverse {
            animation: marquee-reverse 30s linear infinite;
          }
          .testimonials-row:hover .animate-marquee,
          .testimonials-row:hover .animate-marquee-reverse {
            animation-play-state: paused;
          }
        \`}} />

        {/* Marquee Container with Gradient Mask */}
        <div className="relative flex flex-col overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] pb-10 gap-6 md:gap-8">

          {/* Row 1 - Scrolling Left */}
          <div className="w-full testimonials-row overflow-hidden flex">
            <div className="flex animate-marquee min-w-max gap-6 md:gap-8 pr-6 md:pr-8">
              {[...Array(2)].map((_, arrayIndex) => [
                { name: "Rahul Malhotra", text: "PartyDial made our wedding planning so much easier! We received 5 quotes within 2 hours and booked a beautiful palace.", avatar: "https://randomuser.me/api/portraits/men/18.jpg" },
                { name: "Sneha Kapoor", text: "As a corporate event planner, I need quick responses. PartyDial delivered! Found an amazing rooftop venue for our team's meet.", avatar: "https://randomuser.me/api/portraits/women/20.jpg" },
                { name: "Amit Verma", text: "Found the perfect banquet hall for my son's 1st birthday. The zero brokerage promise is real – we saved a lot!", avatar: "https://randomuser.me/api/portraits/men/24.jpg" },
                { name: "Priya Sharma", text: "The aesthetic of the venues I found through PartyDial was incredible. Perfect for my content and within budget!", avatar: "https://randomuser.me/api/portraits/women/45.jpg" },
                { name: "Vikram Singh", text: "Professional service and transparent pricing. No hidden costs. Best platform for premium venue discovery.", avatar: "https://randomuser.me/api/portraits/men/63.jpg" }
              ].map((t, i) => (
                <div key={\`\${arrayIndex}-\${i}\`} className="w-[320px] md:w-[420px] shrink-0">`;

const rep2 = `                </div>
              )))}
            </div>
          </div>

          {/* Row 2 - Scrolling Right */}
          <div className="w-full testimonials-row overflow-hidden flex">
            <div className="flex animate-marquee-reverse min-w-max gap-6 md:gap-8 pr-6 md:pr-8">
              {[...Array(2)].map((_, arrayIndex) => [
                { name: "Neha Gupta", role: "Anniversary Celebration", text: "Booked a resort for our 10th anniversary. The options provided were exactly what we had in mind. Flawless experience!", avatar: "6" },
                { name: "Karan Desai", role: "Event Organizer", text: "I regularly use PartyDial for my clients. The interface is smooth, and the venues listed are verified. It saves me days of research.", avatar: "7" },
                { name: "Anjali Rao", role: "Pre-Wedding Shoot", text: "Finding an aesthetic venue for our shoot was tough until we used PartyDial. Directly connected with the owner and booked it!", avatar: "8" },
                { name: "Sameer Khan", role: "Startup Founder", text: "Hosted our product launch party at a venue found here. The direct pricing feature helped us stay well within our bootstrap budget.", avatar: "9" },
                { name: "Pooja Mehta", role: "Baby Shower", text: "Everything from finding the venue to booking was completely hassle-free. Absolutely highly recommend PartyDial to anyone!", avatar: "10" }
              ].map((t, i) => (
                <div key={\`\${arrayIndex}-\${i}\`} className="w-[320px] md:w-[420px] shrink-0">`;

const rep3 = `                </div>
              )))}
            </div>
          </div>
        </div>`;

content = content.replace(target1, rep1);
content = content.replace(target2, rep2);
content = content.replace(target3, rep3);

fs.writeFileSync(file, content);
console.log('Replaced testimonials carousel successfully');
