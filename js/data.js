// ==========================================
// EnglishPro Advanced - Data Module
// Conversation, Pronunciation, Advanced Content
// ==========================================

const APP_DATA = {
  // ---- CONVERSATION SCENARIOS ----
  conversations: {
    restaurant: {
      icon: '🍽️',
      partnerName: 'Waiter',
      title: { en: 'At a Restaurant', id: 'Di Restoran' },
      level: 'intermediate',
      description: { en: 'Practice ordering food and making reservations', id: 'Latihan memesan makanan dan reservasi' },
      dialogue: [
        {
          speaker: 'waiter',
          text: 'Good evening! Welcome to The Golden Fork. Do you have a reservation?',
          translation: 'Selamat malam! Selamat datang di The Golden Fork. Apakah Anda punya reservasi?',
          options: [
            { text: 'Yes, I have a reservation under the name Smith.', next: 1, score: 3 },
            { text: 'No, do you have a table for two?', next: 2, score: 3 },
            { text: 'Hi, table please.', next: 2, score: 1 }
          ]
        },
        {
          speaker: 'waiter',
          text: 'Ah yes, Mr. Smith. Right this way, please. Here is your table by the window.',
          translation: 'Ah ya, Pak Smith. Silakan ikuti jalan ini. Ini meja Anda di dekat jendela.',
          options: [
            { text: 'Thank you, this is a lovely table.', next: 3, score: 3 },
            { text: 'Thanks.', next: 3, score: 2 }
          ]
        },
        {
          speaker: 'waiter',
          text: 'Of course! I can seat you right over here. Would you like to see the menu?',
          translation: 'Tentu! Saya bisa antar Anda ke sini. Apakah Anda mau lihat menu?',
          options: [
            { text: 'Yes, please. Could we also see the wine list?', next: 3, score: 3 },
            { text: 'Sure, thank you.', next: 3, score: 2 },
            { text: 'Yeah give me menu.', next: 3, score: 1 }
          ]
        },
        {
          speaker: 'waiter',
          text: 'Here you are. Can I start you off with some drinks? We have a wonderful house wine tonight.',
          translation: 'Ini menunya. Apakah saya bisa mulai dengan minuman? Kami punya wine rumah yang luar biasa malam ini.',
          options: [
            { text: 'I\'ll have a glass of your house wine, please.', next: 4, score: 3 },
            { text: 'Could I have a sparkling water with lemon?', next: 4, score: 3 },
            { text: 'Just water.', next: 4, score: 1 }
          ]
        },
        {
          speaker: 'waiter',
          text: 'Excellent choice! And are you ready to order your main course, or would you like a few more minutes?',
          translation: 'Pilihan yang bagus! Apakah Anda siap memesan menu utama, atau butuh waktu beberapa menit lagi?',
          options: [
            { text: 'I think I\'m ready. I\'ll have the grilled salmon with seasonal vegetables.', next: 5, score: 3 },
            { text: 'Could you give us a few more minutes, please?', next: 5, score: 3 },
            { text: 'What do you recommend?', next: 5, score: 2 }
          ]
        },
        {
          speaker: 'waiter',
          text: 'Wonderful! The salmon is an excellent choice. Would you like any appetizers or soup to start?',
          translation: 'Luar biasa! Salmon adalah pilihan yang bagus. Apakah Anda mau appetizer atau sup untuk mulai?',
          options: [
            { text: 'Yes, I\'ll start with the Caesar salad, please.', next: 6, score: 3 },
            { text: 'No thank you, just the main course is fine.', next: 6, score: 2 },
            { text: 'What soup do you have today?', next: 6, score: 3 }
          ]
        },
        {
          speaker: 'waiter',
          text: 'Perfect! I\'ll put your order right in. Your food should be ready in about 15 minutes. Is there anything else I can get you?',
          translation: 'Sempurna! Saya akan masukkan pesanan Anda. Makanan akan siap sekitar 15 menit. Ada lagi yang bisa saya bantu?',
          options: [
            { text: 'That\'s all for now, thank you very much.', next: 7, score: 3 },
            { text: 'Could we have some bread while we wait?', next: 7, score: 3 },
            { text: 'No, that\'s it.', next: 7, score: 2 }
          ]
        },
        {
          speaker: 'waiter',
          text: 'Of course! I\'ll bring some bread right away. Enjoy your evening!',
          translation: 'Tentu! Saya akan bawa roti sekarang. Selamat menikmati malam Anda!',
          options: [],
          end: true
        }
      ]
    },
    job_interview: {
      icon: '💼',
      partnerName: 'Interviewer',
      title: { en: 'Job Interview', id: 'Wawancara Kerja' },
      level: 'advanced',
      description: { en: 'Practice common job interview questions', id: 'Latihan pertanyaan wawancara kerja umum' },
      dialogue: [
        {
          speaker: 'interviewer',
          text: 'Good morning! Thank you for coming in today. Please, have a seat. Could you start by telling me a little about yourself?',
          translation: 'Selamat pagi! Terima kasih sudah datang hari ini. Silakan duduk. Bisakah Anda ceritakan sedikit tentang diri Anda?',
          options: [
            { text: 'Good morning! Thank you for this opportunity. I\'m a software engineer with five years of experience in web development. I\'m passionate about creating user-friendly applications.', next: 1, score: 3 },
            { text: 'Hi, I\'m John. I like coding and I\'m looking for a job.', next: 1, score: 1 },
            { text: 'Good morning! I graduated from ITB with a degree in Computer Science. I\'ve been working at a tech startup for the past three years, where I led a team of five developers.', next: 1, score: 3 }
          ]
        },
        {
          speaker: 'interviewer',
          text: 'That sounds impressive! What would you say is your greatest strength, and how has it helped you in your career?',
          translation: 'Kedengarannya mengesankan! Apa kekuatan terbesar Anda, dan bagaimana itu membantu karir Anda?',
          options: [
            { text: 'I\'d say my greatest strength is problem-solving. I enjoy breaking down complex issues into manageable parts. For example, at my previous company, I optimized our database queries which reduced load times by 40%.', next: 2, score: 3 },
            { text: 'I\'m a hard worker and I always finish my tasks.', next: 2, score: 1 },
            { text: 'My biggest strength is communication. I believe technical skills are important, but being able to explain complex concepts to non-technical stakeholders is equally valuable.', next: 2, score: 3 }
          ]
        },
        {
          speaker: 'interviewer',
          text: 'Excellent. Now, can you tell me about a challenging project you worked on and how you overcame the difficulties?',
          translation: 'Bagus. Sekarang, bisakah Anda ceritakan tentang proyek menantang yang Anda kerjakan dan bagaimana Anda mengatasi kesulitannya?',
          options: [
            { text: 'Certainly. Last year, our team was tasked with migrating our legacy system to a microservices architecture within three months. The main challenge was ensuring zero downtime. I created a detailed migration plan, implemented feature flags, and we successfully completed the migration with 99.9% uptime.', next: 3, score: 3 },
            { text: 'I had a hard project once but we finished it.', next: 3, score: 1 },
            { text: 'One challenging project involved building a real-time notification system. The main difficulty was handling concurrent users. I researched message queues, implemented RabbitMQ, and conducted extensive load testing to ensure scalability.', next: 3, score: 3 }
          ]
        },
        {
          speaker: 'interviewer',
          text: 'Very impressive problem-solving approach! Where do you see yourself in five years?',
          translation: 'Pendekatan problem-solving yang sangat mengesankan! Di mana Anda melihat diri Anda dalam lima tahun?',
          options: [
            { text: 'In five years, I see myself in a senior technical leadership role where I can mentor junior developers while still contributing to the codebase. I\'m also interested in exploring cloud architecture.', next: 4, score: 3 },
            { text: 'I want to be a manager.', next: 4, score: 1 },
            { text: 'I hope to have grown significantly in my technical skills and to be leading innovative projects. I\'m particularly interested in AI and machine learning, and I\'d love to incorporate those into my work.', next: 4, score: 3 }
          ]
        },
        {
          speaker: 'interviewer',
          text: 'That\'s a great vision. Do you have any questions for me about the company or the role?',
          translation: 'Visi yang bagus. Apakah Anda punya pertanyaan untuk saya tentang perusahaan atau posisi ini?',
          options: [
            { text: 'Yes, I\'d love to know more about the team I\'d be working with and the technologies you\'re currently using.', next: 5, score: 3 },
            { text: 'What does a typical day look like for someone in this position?', next: 5, score: 3 },
            { text: 'No, I think I\'m good.', next: 5, score: 1 }
          ]
        },
        {
          speaker: 'interviewer',
          text: 'Great questions! We\'ll be in touch within the next week. Thank you for your time today. It was a pleasure meeting you.',
          translation: 'Pertanyaan bagus! Kami akan menghubungi Anda dalam seminggu ke depan. Terima kasih atas waktunya hari ini. Senang bertemu dengan Anda.',
          options: [
            { text: 'Thank you so much for your time. I really enjoyed learning about the company and I\'m very excited about this opportunity.', next: 6, score: 3 },
            { text: 'Thanks, bye.', next: 6, score: 1 },
            { text: 'Thank you! I look forward to hearing from you. Have a great day!', next: 6, score: 3 }
          ]
        },
        {
          speaker: 'interviewer',
          text: 'Thank you! We\'ll be in contact soon. Have a wonderful day!',
          translation: 'Terima kasih! Kami akan segera menghubungi Anda. Semoga harimu menyenangkan!',
          options: [],
          end: true
        }
      ]
    },
    travel: {
      icon: '✈️',
      partnerName: 'Agent',
      title: { en: 'At the Airport', id: 'Di Bandara' },
      level: 'intermediate',
      description: { en: 'Navigate airport situations confidently', id: 'Hadapi situasi bandara dengan percaya diri' },
      dialogue: [
        {
          speaker: 'agent',
          text: 'Good morning! May I see your passport and boarding pass, please?',
          translation: 'Selamat pagi! Boleh saya lihat paspor dan boarding pass Anda?',
          options: [
            { text: 'Good morning! Here you go.', next: 1, score: 2 },
            { text: 'Of course, here\'s my passport and boarding pass.', next: 1, score: 3 },
            { text: 'Yeah here.', next: 1, score: 1 }
          ]
        },
        {
          speaker: 'agent',
          text: 'Thank you. I see you\'re flying to London today. Would you like a window or aisle seat?',
          translation: 'Terima kasih. Saya lihat Anda terbang ke London hari ini. Apakah Anda mau kursi dekat jendela atau lorong?',
          options: [
            { text: 'A window seat would be perfect, please.', next: 2, score: 3 },
            { text: 'I prefer an aisle seat, thank you.', next: 2, score: 3 },
            { text: 'Window.', next: 2, score: 1 }
          ]
        },
        {
          speaker: 'agent',
          text: 'I\'ve given you seat 14A, a window seat. How many bags are you checking in today?',
          translation: 'Saya beri Anda kursi 14A, dekat jendela. Berapa tas yang Anda check-in hari ini?',
          options: [
            { text: 'I have one suitcase to check in and one carry-on bag.', next: 3, score: 3 },
            { text: 'Just this one bag.', next: 3, score: 2 },
            { text: 'One.', next: 3, score: 1 }
          ]
        },
        {
          speaker: 'agent',
          text: 'Perfect. Your bag weighs 18 kilograms, which is within the allowance. Your flight departs from Gate B12 at 10:30 AM. Boarding begins at 9:45 AM. Is there anything else I can help with?',
          translation: 'Sempurna. Tas Anda beratnya 18 kilogram, masih dalam batas. Penerbangan Anda berangkat dari Gerbang B12 pukul 10:30. Boarding mulai pukul 9:45. Ada lagi yang bisa saya bantu?',
          options: [
            { text: 'Could you tell me where the nearest lounge is?', next: 4, score: 3 },
            { text: 'Is the flight on time?', next: 4, score: 3 },
            { text: 'No, thank you for your help.', next: 4, score: 2 }
          ]
        },
        {
          speaker: 'agent',
          text: 'The VIP lounge is on the second floor, just past the duty-free shops. Your flight is currently on time. Have a pleasant journey!',
          translation: 'VIP lounge ada di lantai dua, melewati toko duty-free. Penerbangan Anda saat ini tepat waktu. Semoga perjalanan menyenangkan!',
          options: [],
          end: true
        }
      ]
    },
    doctor: {
      icon: '🏥',
      partnerName: 'Doctor',
      title: { en: 'Visiting a Doctor', id: 'Ke Dokter' },
      level: 'intermediate',
      description: { en: 'Describe symptoms and understand medical advice', id: 'Deskripsikan gejala dan pahami saran medis' },
      dialogue: [
        {
          speaker: 'doctor',
          text: 'Good morning! I\'m Dr. Chen. What brings you in today?',
          translation: 'Selamat pagi! Saya Dr. Chen. Ada keluhan apa hari ini?',
          options: [
            { text: 'Good morning, Doctor. I\'ve been having a persistent headache for the past three days, and I feel quite fatigued.', next: 1, score: 3 },
            { text: 'I have a headache.', next: 1, score: 1 },
            { text: 'Hi, I\'ve been feeling unwell lately. I have headaches and I\'ve been very tired.', next: 1, score: 2 }
          ]
        },
        {
          speaker: 'doctor',
          text: 'I see. Can you describe the headache? Is it a sharp pain, a dull ache, or more of a throbbing sensation? And where exactly do you feel it?',
          translation: 'Bisa deskripsikan sakit kepalanya? Apakah tajam, tumpah, atau berdenyut? Dan di mana tepatnya Anda merasakannya?',
          options: [
            { text: 'It\'s more of a dull, constant ache around my forehead and temples. It gets worse in the afternoon.', next: 2, score: 3 },
            { text: 'It hurts here, on my forehead.', next: 2, score: 2 },
            { text: 'Just regular headache, all over.', next: 2, score: 1 }
          ]
        },
        {
          speaker: 'doctor',
          text: 'Have you experienced any other symptoms? For example, nausea, sensitivity to light, difficulty sleeping, or changes in appetite?',
          translation: 'Apakah Anda mengalami gejala lain? Misalnya mual, sensitif terhadap cahaya, sulit tidur, atau perubahan nafsu makan?',
          options: [
            { text: 'Yes, actually I\'ve been having trouble sleeping. I wake up around 3 AM and can\'t fall back asleep. And I\'ve noticed I\'m not as hungry as usual.', next: 3, score: 3 },
            { text: 'Maybe a little, I\'m not sure.', next: 3, score: 1 },
            { text: 'I do feel a bit nauseous sometimes, especially in the morning.', next: 3, score: 2 }
          ]
        },
        {
          speaker: 'doctor',
          text: 'Based on what you\'re describing, it sounds like you might be experiencing tension headaches, possibly related to stress and lack of sleep. I\'d like to check your blood pressure first. Can you roll up your sleeve?',
          translation: 'Berdasarkan apa yang Anda deskripsikan, sepertinya Anda mengalami tegang kepala, mungkin terkait stres dan kurang tidur. Saya mau cek tekanan darah dulu. Bisa gulung lengan baju?',
          options: [
            { text: 'Of course. I have been under a lot of stress at work lately.', next: 4, score: 3 },
            { text: 'Sure, here you go.', next: 4, score: 2 },
            { text: 'Okay.', next: 4, score: 1 }
          ]
        },
        {
          speaker: 'doctor',
          text: 'Your blood pressure is 130 over 85, which is slightly elevated. I\'d recommend getting more rest, reducing caffeine intake, and managing your stress levels. I can also prescribe some mild pain relief. Would you like me to write a prescription?',
          translation: 'Tekanan darah Anda 130/85, sedikit tinggi. Saya sarankan lebih banyak istirahat, kurangi kafein, dan kelola tingkat stres. Saya juga bisa resepkan pereda nyeri ringan. Mau saya tuliskan resep?',
          options: [
            { text: 'Yes, please. And should I come back for a follow-up appointment?', next: 5, score: 3 },
            { text: 'What about side effects of the medication?', next: 5, score: 3 },
            { text: 'Just give me medicine.', next: 5, score: 1 }
          ]
        },
        {
          speaker: 'doctor',
          text: 'I\'ll write a prescription for ibuprofen, 400mg, to be taken with food. Please come back in two weeks if the headaches persist. Also, try to get at least 7 hours of sleep and limit screen time before bed. Take care!',
          translation: 'Saya tuliskan resep ibuprofen 400mg, diminum bersama makanan. Kembali dalam dua minggu jika sakit kepala berlanjut. Coba tidur minimal 7 jam dan kurangi layar sebelum tidur. Jaga kesehatan!',
          options: [],
          end: true
        }
      ]
    },
    shopping: {
      icon: '🛍️',
      partnerName: 'Clerk',
      title: { en: 'Shopping', id: 'Berbelanja' },
      level: 'beginner',
      description: { en: 'Practice shopping conversations', id: 'Latihan percakapan berbelanja' },
      dialogue: [
        {
          speaker: 'clerk',
          text: 'Hi there! Welcome to Fashion Hub. Is there anything I can help you find today?',
          translation: 'Halo! Selamat datang di Fashion Hub. Ada yang bisa saya bantu hari ini?',
          options: [
            { text: 'Yes, I\'m looking for a casual jacket for the fall season.', next: 1, score: 3 },
            { text: 'I\'m just browsing, thank you.', next: 2, score: 2 },
            { text: 'Yeah, I need jacket.', next: 1, score: 1 }
          ]
        },
        {
          speaker: 'clerk',
          text: 'Great choice! We have a wonderful selection of fall jackets. What size are you looking for?',
          translation: 'Pilihan bagus! Kami punya pilihan jaket musim gugur yang bagus. Ukuran berapa yang Anda cari?',
          options: [
            { text: 'I usually wear a medium. Do you have this in navy blue?', next: 3, score: 3 },
            { text: 'Medium.', next: 3, score: 1 },
            { text: 'I\'m not sure about my size. Could you help me find the right fit?', next: 3, score: 3 }
          ]
        },
        {
          speaker: 'clerk',
          text: 'Of course! Feel free to look around. Let me know if you need any help or would like to try anything on.',
          translation: 'Tentu! Silakan lihat-lihat. Kabari saya jika butuh bantuan atau mau mencoba.',
          options: [
            { text: 'Thank you! How much is this jacket?', next: 3, score: 2 },
            { text: 'Actually, could you help me find something?', next: 1, score: 2 }
          ]
        },
        {
          speaker: 'clerk',
          text: 'Yes, we have it in navy blue! It\'s $89.99, and we currently have a 20% discount on all fall items. Would you like to try it on?',
          translation: 'Ya, kami punya warna biru navy! Harganya $89.99, dan saat ini ada diskon 20% untuk semua item musim gugur. Mau coba?',
          options: [
            { text: 'Yes, I\'d love to try it on. Where are the fitting rooms?', next: 4, score: 3 },
            { text: 'That\'s a bit over my budget. Do you have anything similar but more affordable?', next: 4, score: 3 },
            { text: 'Okay, I take it.', next: 4, score: 1 }
          ]
        },
        {
          speaker: 'clerk',
          text: 'The fitting rooms are right over there. Take your time! If you decide to purchase, we also offer free alterations.',
          translation: 'Ruang ganti ada di sana. Silakan! Jika Anda memutuskan beli, kami juga menawarkan permak gratis.',
          options: [
            { text: 'This fits perfectly! I\'ll take it. Can I pay by credit card?', next: 5, score: 3 },
            { text: 'It\'s a little tight. Do you have one size up?', next: 5, score: 3 },
            { text: 'I\'ll think about it.', next: 5, score: 1 }
          ]
        },
        {
          speaker: 'clerk',
          text: 'Of course! We accept all major credit cards. Your total comes to $71.99 with the discount. Would you like a shopping bag?',
          translation: 'Tentu! Kami terima semua kartu kredit utama. Total Anda $71.99 setelah diskon. Mau tas belanja?',
          options: [
            { text: 'Yes, please. Thank you for your help!', next: 6, score: 3 },
            { text: 'No bag needed, thanks.', next: 6, score: 2 }
          ]
        },
        {
          speaker: 'clerk',
          text: 'Here you go! Enjoy your new jacket. Have a wonderful day!',
          translation: 'Ini dia! Selamat menikmati jaket barunya. Semoga harimu menyenangkan!',
          options: [],
          end: true
        }
      ]
    },

    // ---- NEW: Friend Chat ----
    friend_chat: {
      icon: '😄',
      partnerName: 'Alex',
      title: { en: 'Chatting with a Friend', id: 'Ngobrol dengan Teman' },
      level: 'beginner',
      description: { en: 'Practice casual conversations with friends', id: 'Latihan percakapan santai dengan teman' },
      userStart: 0,
      dialogue: [
        {
          speaker: 'friend',
          userPrompt: { en: 'Your friend Alex sends you a message. Say something!', id: 'Temanmu Alex mengirim pesan. Katakan sesuatu!' },
          text: '',
          translation: '',
          options: [
            { text: 'Hey Alex! What\'s up?', next: 1, score: 3 },
            { text: 'Hi! Long time no see!', next: 1, score: 3 },
            { text: 'Yo', next: 1, score: 1 }
          ]
        },
        {
          speaker: 'friend',
          text: 'Hey! Not much, just chilling at home. You?',
          translation: 'Hei! Lagi santai aja di rumah. Kamu?',
          options: [
            { text: 'Same here! Want to hang out this weekend?', next: 2, score: 3 },
            { text: 'I\'m bored too. Let\'s do something!', next: 2, score: 2 },
            { text: 'Nothing.', next: 2, score: 1 }
          ]
        },
        {
          speaker: 'friend',
          text: 'Yeah sure! How about we grab coffee on Saturday?',
          translation: 'Yuk! Gimana kalau ngopi hari Sabtu?',
          options: [
            { text: 'That sounds like a great idea! How about Saturday afternoon?', next: 3, score: 3 },
            { text: 'Sure, let\'s do it!', next: 3, score: 2 },
            { text: 'I\'m busy this weekend, maybe next time.', next: 3, score: 2 }
          ]
        },
        {
          speaker: 'friend',
          text: 'Saturday works! Let\'s meet at the new cafe on Main Street around 2 PM. Oh and invite Maya too, she\'s been asking about you!',
          translation: 'Sabtu cocok! Ketemu di kafe baru di Jalan Utama jam 2. Oh dan ajak Maya juga, dia nanya tentang kamu!',
          options: [
            { text: 'Perfect! I\'ll text Maya. Can\'t wait to catch up with you guys!', next: 4, score: 3 },
            { text: 'Okay see you there!', next: 4, score: 2 },
            { text: 'Sure, sounds good.', next: 4, score: 1 }
          ]
        },
        {
          speaker: 'friend',
          text: 'Awesome! See you Saturday! Take care! 😊',
          translation: 'Mantap! Sampai Sabtu! Jaga diri!',
          options: [],
          end: true
        }
      ]
    },

    // ---- NEW: Romantic Partner ----
    partner_chat: {
      icon: '💕',
      partnerName: 'Sam',
      title: { en: 'Talking to Your Partner', id: 'Bicara dengan Pasangan' },
      level: 'intermediate',
      description: { en: 'Practice sweet conversations with your loved one', id: 'Latihan percakapan manis dengan kekasih' },
      userStart: 0,
      dialogue: [
        {
          speaker: 'partner',
          userPrompt: { en: 'Your partner Sam sends you a sweet message. Reply!', id: 'Pasanganmu Sam mengirim pesan manis. Balas!' },
          text: '',
          translation: '',
          options: [
            { text: 'Hey babe! I miss you so much!', next: 1, score: 3 },
            { text: 'Hi sweetheart!', next: 1, score: 2 },
            { text: 'Hey', next: 1, score: 1 }
          ]
        },
        {
          speaker: 'partner',
          text: 'Hey love! I miss you so much. How was your day?',
          translation: 'Sayang! Aku kangen banget. Bagaimana harimu?',
          options: [
            { text: 'I miss you too! My day was busy but hearing from you makes it better.', next: 2, score: 3 },
            { text: 'Hey babe! It was fine. How about yours?', next: 2, score: 2 },
            { text: 'It was ok.', next: 2, score: 1 }
          ]
        },
        {
          speaker: 'partner',
          text: 'I miss you too! I was thinking, maybe we could cook dinner together tonight? I found a new pasta recipe I want to try.',
          translation: 'Aku juga kangen! Aku pikir, mungkin kita bisa masak malam bersama? Aku nemu resep pasta baru yang mau dicoba.',
          options: [
            { text: 'I would love that! Cooking with you is always fun. Should I bring anything?', next: 3, score: 3 },
            { text: 'Sounds romantic! What time should I come over?', next: 3, score: 3 },
            { text: 'Sure why not.', next: 3, score: 1 }
          ]
        },
        {
          speaker: 'partner',
          text: 'Just bring yourself and maybe some wine? I\'ll handle everything else. Can\'t wait to see you tonight! 💕',
          translation: 'Bawa diri aja dan mungkin wine? Aku urus yang lain. Nggak sabar ketemu malam ini!',
          options: [
            { text: 'It\'s a date! I\'ll be there at 7. Love you! 💕', next: 4, score: 3 },
            { text: 'Perfect! See you tonight, love!', next: 4, score: 3 },
            { text: 'Ok see u.', next: 4, score: 1 }
          ]
        },
        {
          speaker: 'partner',
          text: 'Love you more! See you tonight! 😘',
          translation: 'Aku lebih cinta kamu! Sampai malam ini!',
          options: [],
          end: true
        }
      ]
    },

    // ---- NEW: Teacher/Professor ----
    teacher_chat: {
      icon: '👨‍🏫',
      partnerName: 'Prof. Johnson',
      title: { en: 'Talking to a Teacher', id: 'Bicara dengan Guru' },
      level: 'advanced',
      description: { en: 'Practice formal academic conversations', id: 'Latihan percakapan akademis formal' },
      userStart: 0,
      dialogue: [
        {
          speaker: 'teacher',
          userPrompt: { en: 'You need to ask your professor about an assignment. What do you say?', id: 'Kamu perlu bertanya ke dosen tentang tugas. Apa yang kamu katakan?' },
          text: '',
          translation: '',
          options: [
            { text: 'Good afternoon, Professor. I have some questions about the essay assignment.', next: 1, score: 3 },
            { text: 'Hi, I want to ask about the homework.', next: 1, score: 2 },
            { text: 'Hey, about the assignment...', next: 1, score: 1 }
          ]
        },
        {
          speaker: 'teacher',
          text: 'Good afternoon! Of course, what would you like to know?',
          translation: 'Selamat siang! Tentu, apa yang ingin kamu tanyakan?',
          options: [
            { text: 'I was wondering if we need peer-reviewed journals, or are online sources acceptable?', next: 2, score: 3 },
            { text: 'Can I write about something else instead?', next: 2, score: 1 },
            { text: 'How many sources do we need?', next: 2, score: 2 }
          ]
        },
        {
          speaker: 'teacher',
          text: 'Great question. I\'d prefer at least three peer-reviewed sources, but you can supplement with reputable online sources. Use proper APA citation format.',
          translation: 'Pertanyaan bagus. Saya lebih suka setidaknya tiga sumber peer-review, tapi bisa tambahkan sumber online terpercaya. Gunakan format kutipan APA.',
          options: [
            { text: 'Thank you, Professor. Would it be possible to get an extension? I\'ve been having some difficulties.', next: 3, score: 3 },
            { text: 'Got it. When is the exact deadline?', next: 3, score: 2 },
            { text: 'Ok thanks.', next: 3, score: 1 }
          ]
        },
        {
          speaker: 'teacher',
          text: 'I understand. I can give you until Friday. Please email me if you need further assistance. Good luck with your essay!',
          translation: 'Saya mengerti. Saya bisa beri waktu sampai Jumat. Email saya jika butuh bantuan. Semoga beruntung!',
          options: [],
          end: true
        }
      ]
    },

    // ---- NEW: Boss/Manager ----
    boss_chat: {
      icon: '👔',
      partnerName: 'Mr. Davis',
      title: { en: 'Talking to Your Boss', id: 'Bicara dengan Atasan' },
      level: 'advanced',
      description: { en: 'Practice professional workplace conversations', id: 'Latihan percakapan profesional di tempat kerja' },
      userStart: 0,
      dialogue: [
        {
          speaker: 'boss',
          userPrompt: { en: 'Your boss Mr. Davis asks to see you. What do you say?', id: 'Atasanmu Pak Davis ingin bertemu. Apa yang kamu katakan?' },
          text: '',
          translation: '',
          options: [
            { text: 'Good morning, Mr. Davis. I\'d appreciate any feedback you have.', next: 1, score: 3 },
            { text: 'Morning. Is something wrong?', next: 1, score: 1 },
            { text: 'Thank you, sir. I\'m eager to hear your thoughts.', next: 1, score: 3 }
          ]
        },
        {
          speaker: 'boss',
          text: 'Good morning. Please, have a seat. I wanted to talk about the recent project.',
          translation: 'Selamat pagi. Silakan duduk. Saya ingin bicara tentang proyek terbaru.',
          options: [
            { text: 'I apologize for the delay. I underestimated the data analysis needed. I\'ve put measures in place to prevent this.', next: 2, score: 3 },
            { text: 'Sorry about that. It won\'t happen again.', next: 2, score: 2 },
            { text: 'The data was hard to get.', next: 2, score: 1 }
          ]
        },
        {
          speaker: 'boss',
          text: 'I appreciate your accountability. What specific steps are you taking to ensure timely delivery going forward?',
          translation: 'Saya hargai tanggung jawabmu. Langkah spesifik apa yang kamu ambil untuk pengiriman tepat waktu ke depan?',
          options: [
            { text: 'I\'m using project management tools and setting personal deadlines two days before the actual due date.', next: 3, score: 3 },
            { text: 'I\'ll try to manage my time better.', next: 3, score: 1 },
            { text: 'I\'m building buffer time and will give weekly progress updates.', next: 3, score: 3 }
          ]
        },
        {
          speaker: 'boss',
          text: 'Excellent approach. I\'m confident you\'ll handle future projects well. Let\'s touch base next month. Keep up the good work!',
          translation: 'Pendekatan bagus. Saya yakin kamu akan tangani proyek berikutnya dengan baik. Evaluasi lagi bulan depan. Pertahankan!',
          options: [],
          end: true
        }
      ]
    },

    // ---- NEW: New Neighbor ----
    neighbor_chat: {
      icon: '🏠',
      partnerName: 'Mrs. Lee',
      title: { en: 'Meeting a New Neighbor', id: 'Bertemu Tetangga Baru' },
      level: 'beginner',
      description: { en: 'Practice introducing yourself to neighbors', id: 'Latihan memperkenalkan diri ke tetangga' },
      userStart: 0,
      dialogue: [
        {
          speaker: 'neighbor',
          userPrompt: { en: 'You just moved in. Your neighbor Mrs. Lee comes to say hello. Start!', id: 'Kamu baru pindah. Tetanggamu Bu Lee datang menyapa. Mulai!' },
          text: '',
          translation: '',
          options: [
            { text: 'Hi! I just moved in. Nice to meet you!', next: 1, score: 3 },
            { text: 'Hello! Are you my neighbor?', next: 1, score: 2 },
            { text: 'Hey', next: 1, score: 1 }
          ]
        },
        {
          speaker: 'neighbor',
          text: 'Hi there! Welcome to the neighborhood!',
          translation: 'Halo! Selamat datang di lingkungan ini!',
          options: [
            { text: 'Thank you so much! Yes, I moved here with my family. We\'re excited to explore the area!', next: 2, score: 3 },
            { text: 'Nice to meet you! I think we\'re good for now, thanks.', next: 2, score: 2 },
            { text: 'Thanks.', next: 2, score: 1 }
          ]
        },
        {
          speaker: 'neighbor',
          text: 'How wonderful! There\'s a great park two blocks away. And we have a neighborhood BBQ every last Saturday. You should come!',
          translation: 'Bagus sekali! Ada taman bagus dua blok dari sini. Dan kami ada BBQ lingkungan setiap Sabtu terakhir. Harus datang!',
          options: [
            { text: 'That sounds amazing! We\'ll definitely join. Should I bring anything?', next: 3, score: 3 },
            { text: 'We\'d love to come! Thank you for inviting us.', next: 3, score: 3 },
            { text: 'Maybe.', next: 3, score: 1 }
          ]
        },
        {
          speaker: 'neighbor',
          text: 'Just bring yourselves! Everyone is very friendly. Welcome again, and see you at the BBQ! 🏡',
          translation: 'Bawa diri aja! Semuanya ramah. Selamat datang lagi, dan sampai jumpa di BBQ!',
          options: [],
          end: true
        }
      ]
    }
  },

  // ---- PRONUNCIATION EXERCISES ----
  pronunciation: {
    tongue_twisters: {
      icon: '👅',
      title: { en: 'Tongue Twisters', id: 'Latihan Lidah' },
      exercises: [
        { text: 'She sells seashells by the seashore.', difficulty: 'hard' },
        { text: 'Peter Piper picked a peck of pickled peppers.', difficulty: 'hard' },
        { text: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?', difficulty: 'hard' },
        { text: 'Red lorry, yellow lorry, red lorry, yellow lorry.', difficulty: 'medium' },
        { text: 'Unique New York, unique New York, you know you need unique New York.', difficulty: 'medium' },
        { text: 'The sixth sick sheikh\'s sixth sheep\'s sick.', difficulty: 'extreme' },
        { text: 'Pad kid poured curd pulled cod.', difficulty: 'extreme' },
        { text: 'A proper copper coffee pot.', difficulty: 'medium' }
      ]
    },
    minimal_pairs: {
      icon: '👂',
      title: { en: 'Minimal Pairs', id: 'Pasangan Minimal' },
      exercises: [
        { words: ['ship', 'sheep'], ipa: ['/ʃɪp/', '/ʃiːp/'], hint: 'Short vs long "i" sound' },
        { words: ['bed', 'bad'], ipa: ['/bed/', '/bæd/'], hint: '"e" vs "a" sound' },
        { words: ['think', 'sink'], ipa: ['/θɪŋk/', '/sɪŋk/'], hint: '"th" vs "s" sound' },
        { words: ['light', 'right'], ipa: ['/laɪt/', '/raɪt/'], hint: '"l" vs "r" sound' },
        { words: ['walk', 'work'], ipa: ['/wɔːk/', '/wɜːrk/'], hint: '"aw" vs "er" sound' },
        { words: ['three', 'free'], ipa: ['/θriː/', '/friː/'], hint: '"th" vs "f" sound' },
        { words: ['vest', 'best'], ipa: ['/vest/', '/best/'], hint: '"v" vs "b" sound' },
        { words: ['fan', 'van'], ipa: ['/fæn/', '/væn/'], hint: '"f" vs "v" sound' }
      ]
    },
    sentences: {
      icon: '📖',
      title: { en: 'Sentence Practice', id: 'Latihan Kalimat' },
      exercises: [
        { text: 'The quick brown fox jumps over the lazy dog.', focus: 'All sounds' },
        { text: 'I would like a glass of water, please.', focus: 'Polite requests' },
        { text: 'Could you tell me where the nearest station is?', focus: 'Asking directions' },
        { text: 'I\'ve been studying English for about two years now.', focus: 'Present perfect' },
        { text: 'Although it was raining, we decided to go for a walk.', focus: 'Complex sentences' },
        { text: 'The pharmaceutical company announced a breakthrough in research.', focus: 'Academic vocabulary' },
        { text: 'I appreciate your help with this matter.', focus: 'Formal expressions' },
        { text: 'Would you mind if I opened the window?', focus: 'Polite questions' }
      ]
    }
  },

  // ---- LISTENING EXERCISES ----
  listening: {
    dictation: {
      icon: '🎧',
      title: { en: 'Dictation', id: 'Dikte' },
      exercises: [
        { audio: 'The weather forecast predicts heavy rain tomorrow.', answer: 'The weather forecast predicts heavy rain tomorrow.' },
        { audio: 'She has been working at the hospital for over a decade.', answer: 'She has been working at the hospital for over a decade.' },
        { audio: 'Could you please repeat that more slowly?', answer: 'Could you please repeat that more slowly?' },
        { audio: 'The conference has been postponed until next Friday.', answer: 'The conference has been postponed until next Friday.' },
        { audio: 'I would appreciate it if you could send me the details.', answer: 'I would appreciate it if you could send me the details.' }
      ]
    }
  },

  // ---- ADVANCED VOCABULARY ----
  advancedVocab: {
    idioms: {
      icon: '💡',
      title: { en: 'Idioms & Expressions', id: 'Idiom & Ekspresi' },
      words: [
        { en: 'Break the ice', id: 'Mencairkan suasana', example: 'He told a joke to break the ice at the meeting.' },
        { en: 'Hit the nail on the head', id: 'Tepat sasaran', example: 'You hit the nail on the head with that analysis.' },
        { en: 'Bite the bullet', id: 'Menerima kenyataan pahit', example: 'I decided to bite the bullet and apologize.' },
        { en: 'A piece of cake', id: 'Sangat mudah', example: 'The exam was a piece of cake.' },
        { en: 'Under the weather', id: 'Kurang sehat', example: 'I\'m feeling under the weather today.' },
        { en: 'Cost an arm and a leg', id: 'Sangat mahal', example: 'That car cost an arm and a leg.' },
        { en: 'Barking up the wrong tree', id: 'Salah sasaran', example: 'If you think I did it, you\'re barking up the wrong tree.' },
        { en: 'The ball is in your court', id: 'Sekarang giliranmu', example: 'I\'ve made my offer. The ball is in your court.' }
      ]
    },
    phrasalVerbs: {
      icon: '🔗',
      title: { en: 'Phrasal Verbs', id: 'Kata Kerja Berfrasa' },
      words: [
        { en: 'Look forward to', id: 'Menantikan', example: 'I look forward to meeting you.' },
        { en: 'Put up with', id: 'Tahan/mampu bertahan', example: 'I can\'t put up with this noise anymore.' },
        { en: 'Come up with', id: 'Memikirkan/berhasil membuat', example: 'She came up with a brilliant solution.' },
        { en: 'Get along with', id: 'Akur/berhubungan baik', example: 'I get along with my colleagues.' },
        { en: 'Run out of', id: 'Kehabisan', example: 'We\'ve run out of milk.' },
        { en: 'Look into', id: 'Menyelidiki', example: 'The police will look into the matter.' },
        { en: 'Turn down', id: 'Menolak', example: 'She turned down the job offer.' },
        { en: 'Bring up', id: 'Mengangkat topik', example: 'He brought up an interesting point.' }
      ]
    },
    academic: {
      icon: '🎓',
      title: { en: 'Academic English', id: 'Bahasa Inggris Akademik' },
      words: [
        { en: 'Furthermore', id: 'Selanjutnya/lebih lanjut', example: 'Furthermore, the evidence suggests a strong correlation.' },
        { en: 'Nevertheless', id: 'Namun demikian', example: 'Nevertheless, we must consider the limitations.' },
        { en: 'Consequently', id: 'Akibatnya', example: 'Consequently, the results were inconclusive.' },
        { en: 'In contrast', id: 'Sebaliknya', example: 'In contrast, the control group showed no improvement.' },
        { en: 'To elaborate', id: 'Untuk menjelaskan lebih lanjut', example: 'To elaborate, let me provide some examples.' },
        { en: 'It is worth noting', id: 'Perlu dicatat', example: 'It is worth noting that the sample size was small.' },
        { en: 'In light of', id: 'Mengingat/dalam terang', example: 'In light of recent events, we need to reconsider.' },
        { en: 'To summarize', id: 'Untuk merangkum', example: 'To summarize, there are three main points.' }
      ]
    }
  },

  // ---- IELTS/TOEFL PRACTICE ----
  ielts: {
    speaking: {
      icon: '🎤',
      title: { en: 'IELTS Speaking', id: 'Speaking IELTS' },
      part1: [
        { topic: 'Hometown', questions: ['Where are you from?', 'What do you like about your hometown?', 'Has your hometown changed much over the years?'] },
        { topic: 'Work/Studies', questions: ['What do you do for a living?', 'Why did you choose that career?', 'What\'s the most interesting part of your job?'] },
        { topic: 'Hobbies', questions: ['What do you do in your free time?', 'How long have you been interested in that?', 'Do you think hobbies are important?'] }
      ],
      part2: [
        { topic: 'Describe a person who has influenced you', prompts: ['Who this person is', 'How you know them', 'What they did', 'Why they influenced you'] },
        { topic: 'Describe a place you would like to visit', prompts: ['Where it is', 'What you know about it', 'What you would do there', 'Why you want to visit'] },
        { topic: 'Describe an important event in your life', prompts: ['What happened', 'When it happened', 'Who was involved', 'Why it was important'] }
      ]
    }
  },

  // ---- UI TRANSLATIONS ----
  i18n: {
    en: {
      appTitle: 'EnglishPro Advanced',
      appSubtitle: 'Master English with AI-Powered Conversations',
      home: 'Home',
      conversation: 'Conversation',
      pronunciation: 'Pronunciation',
      vocabulary: 'Vocabulary',
      more: 'More',
      speak: 'Speak',
      listen: 'Listen',
      practice: 'Practice',
      startConversation: 'Start Conversation',
      yourResponse: 'Your Response',
      tapToSpeak: 'Tap to Speak',
      speaking: 'Listening...',
      score: 'Score',
      accuracy: 'Accuracy',
      excellent: 'Excellent! 🎉',
      good: 'Good! 👍',
      needsPractice: 'Needs Practice 💪',
      tryAgain: 'Try Again',
      next: 'Next',
      back: 'Back',
      complete: 'Complete',
      level: 'Level',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      ielts: 'IELTS/TOEFL',
      listening: 'Listening',
      idioms: 'Idioms',
      phrasalVerbs: 'Phrasal Verbs',
      academic: 'Academic',
      tongueTwisters: 'Tongue Twisters',
      minimalPairs: 'Minimal Pairs',
      sentences: 'Sentence Practice',
      typeWhatYouHear: 'Type what you hear',
      submit: 'Submit',
      correct: 'Correct!',
      incorrect: 'Try again!',
      conversationComplete: 'Conversation Complete!',
      yourScore: 'Your Score',
      pronunciationScore: 'Pronunciation',
      fluencyScore: 'Fluency',
      overallScore: 'Overall',
      practiceAgain: 'Practice Again',
      newConversation: 'New Conversation',
      difficulty: 'Difficulty',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      listenAndRepeat: 'Listen & Repeat',
      recordYourself: 'Record Yourself',
      playAudio: 'Play Audio',
      stopRecording: 'Stop Recording',
      startRecording: 'Start Recording',
      wordMeaning: 'Meaning',
      example: 'Example',
      settings: 'Settings',
      language: 'Language',
      speechSpeed: 'Speech Speed',
      slow: 'Slow',
      normal: 'Normal',
      fast: 'Fast',
      progress: 'Progress',
      totalConversations: 'Conversations',
      wordsLearned: 'Words Learned',
      streak: 'Day Streak',
      achievements: 'Achievements',
      noSpeechDetected: 'No speech detected. Please try again.',
      speakClearly: 'Speak clearly into your microphone',
      prepareToSpeak: 'Prepare to speak...',
      topic: 'Topic',
      part: 'Part',
      tips: 'Tips',
      sampleAnswer: 'Sample Answer',
      showSample: 'Show Sample Answer',
      hideSample: 'Hide Sample Answer',
      settings: 'Settings',
      aiEngine: 'AI Conversation Engine',
      aiEngineDesc: 'Connect Google Gemini API for free-form AI conversations. Without an API key, conversations still work but are limited to scripts.',
      connected: 'Connected',
      notConnected: 'Not connected',
      save: 'Save',
      testConnection: 'Test Connection',
      saved: 'Saved!',
      aiModeActive: 'AI Mode Active',
      scriptMode: 'Script Mode',
      freeTalk: 'Free Talk',
      freeTalkDesc: 'Chat freely about any topic',
      endConversation: 'End Conversation',
      apiKeyRequired: 'Need Gemini API key! Go to More → Settings'
    },
    id: {
      appTitle: 'EnglishPro Advanced',
      appSubtitle: 'Kuasai Bahasa Inggris dengan Percakapan AI',
      home: 'Beranda',
      conversation: 'Percakapan',
      pronunciation: 'Pengucapan',
      vocabulary: 'Kosakata',
      more: 'Lainnya',
      speak: 'Bicara',
      listen: 'Dengarkan',
      practice: 'Latihan',
      startConversation: 'Mulai Percakapan',
      yourResponse: 'Responmu',
      tapToSpeak: 'Ketuk untuk Bicara',
      speaking: 'Mendengarkan...',
      score: 'Skor',
      accuracy: 'Akurasi',
      excellent: 'Luar biasa! 🎉',
      good: 'Bagus! 👍',
      needsPractice: 'Perlu Latihan 💪',
      tryAgain: 'Coba Lagi',
      next: 'Selanjutnya',
      back: 'Kembali',
      complete: 'Selesai',
      level: 'Level',
      beginner: 'Pemula',
      intermediate: 'Menengah',
      advanced: 'Lanjutan',
      ielts: 'IELTS/TOEFL',
      listening: 'Listening',
      idioms: 'Idiom',
      phrasalVerbs: 'Phrasal Verbs',
      academic: 'Akademik',
      tongueTwisters: 'Latihan Lidah',
      minimalPairs: 'Pasangan Minimal',
      sentences: 'Latihan Kalimat',
      typeWhatYouHear: 'Ketik apa yang kamu dengar',
      submit: 'Kirim',
      correct: 'Benar!',
      incorrect: 'Coba lagi!',
      conversationComplete: 'Percakapan Selesai!',
      yourScore: 'Skor Kamu',
      pronunciationScore: 'Pengucapan',
      fluencyScore: 'Kelancaran',
      overallScore: 'Total',
      practiceAgain: 'Latihan Lagi',
      newConversation: 'Percakapan Baru',
      difficulty: 'Tingkat Kesulitan',
      easy: 'Mudah',
      medium: 'Sedang',
      hard: 'Sulit',
      listenAndRepeat: 'Dengarkan & Ulangi',
      recordYourself: 'Rekam Dirimu',
      playAudio: 'Putar Audio',
      stopRecording: 'Berhenti Merekam',
      startRecording: 'Mulai Merekam',
      wordMeaning: 'Arti',
      example: 'Contoh',
      settings: 'Pengaturan',
      language: 'Bahasa',
      speechSpeed: 'Kecepatan Bicara',
      slow: 'Lambat',
      normal: 'Normal',
      fast: 'Cepat',
      progress: 'Kemajuan',
      totalConversations: 'Percakapan',
      wordsLearned: 'Kata Dipelajari',
      streak: 'Hari Berturut',
      achievements: 'Pencapaian',
      noSpeechDetected: 'Tidak ada suara terdeteksi. Coba lagi.',
      speakClearly: 'Bicara dengan jelas ke mikrofon',
      prepareToSpeak: 'Bersiap untuk bicara...',
      topic: 'Topik',
      part: 'Bagian',
      tips: 'Tips',
      sampleAnswer: 'Contoh Jawaban',
      showSample: 'Tampilkan Contoh',
      hideSample: 'Sembunyikan Contoh',
      settings: 'Pengaturan',
      aiEngine: 'Mesin Percakapan AI',
      aiEngineDesc: 'Hubungkan Google Gemini API supaya AI bisa ngobrol bebas dan fleksibel. Tanpa API key, percakapan tetap jalan tapi terbatas pada script.',
      connected: 'Terhubung',
      notConnected: 'Belum terhubung',
      save: 'Simpan',
      testConnection: 'Test Koneksi',
      saved: 'Tersimpan!',
      aiModeActive: 'Mode AI Aktif',
      scriptMode: 'Mode Script',
      freeTalk: 'Bebas Bicara',
      freeTalkDesc: 'Ngobrol bebas tentang topik apapun',
      endConversation: 'Akhiri Percakapan',
      apiKeyRequired: 'Butuh Gemini API key! Buka More → Settings'
    }
  }
};
