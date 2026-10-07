require("dotenv").config();

const express = require("express");
const { Telegraf, Markup } = require("telegraf");

/* =========================================================
   فحص التوكن قبل أي شيء
========================================================= */

if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN غير موجود في Environment Variables");
  process.exit(1);
}

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

const PORT = process.env.PORT || 3000;

/* =========================================================
   بيانات مؤقتة للطلاب
========================================================= */

const students = new Map();

/* =========================================================
   الباقات
========================================================= */

const packages = [
  { id: 100, minutes: 100, price: 500 },
  { id: 200, minutes: 200, price: 1000 },
  { id: 300, minutes: 300, price: 1470 },
  { id: 400, minutes: 400, price: 1920 },
  { id: 500, minutes: 500, price: 2350 },
  { id: 600, minutes: 600, price: 2760 },
  { id: 1000, minutes: 1000, price: 4500 }
];

/* =========================================================
   الحصول على الطالب
========================================================= */

function getStudent(ctx) {
  const id = String(ctx.from.id);

  if (!students.has(id)) {
    students.set(id, {
      telegramId: id,
      firstName: ctx.from.first_name || "الطالب",
      username: ctx.from.username || "",
      minutes: 0,
      history: [],
      program: null
    });
  }

  return students.get(id);
}

/* =========================================================
   إضافة سجل للدقائق
========================================================= */

function addHistory(student, type, minutes, description) {
  student.history.push({
    date: new Date().toLocaleString("ar-EG"),
    type,
    minutes,
    description
  });
}

/* =========================================================
   القائمة الرئيسية
========================================================= */

function mainMenu() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("📚 البرامج التعليمية", "programs"),
      Markup.button.callback("👨‍🏫 الشيوخ", "teachers")
    ],
    [
      Markup.button.callback("⏱️ رصيد الدقائق", "balance"),
      Markup.button.callback("💳 شراء دقائق", "packages")
    ],
    [
      Markup.button.callback("📅 حجز جلسة", "booking"),
      Markup.button.callback("👤 حسابي", "account")
    ],
    [
      Markup.button.callback("📜 الإجازات والشهادات", "certificates"),
      Markup.button.callback("📚 الكتب والمصاحف", "books")
    ],
    [
      Markup.button.callback("🎧 الصوتيات", "audio"),
      Markup.button.callback("📞 الدعم والمساعدة", "support")
    ]
  ]);
}

/* =========================================================
   START
========================================================= */

bot.start(async (ctx) => {
  const student = getStudent(ctx);

  await ctx.reply(
    `السلام عليكم ورحمة الله وبركاته 🌿

أهلاً وسهلاً بك في

📖 *مقرأة الإمام الجزري للإقراء والإجازة بالسند*

مرحبًا بك يا ${student.firstName} 🌹

نحن نسعى لخدمة كتاب الله تعالى من خلال التعليم المنهجي، والتصحيح، والحفظ، والإقراء والإجازة بالسند.

اختر الخدمة التي تريدها من القائمة أدناه 👇`,
    {
      parse_mode: "Markdown",
      ...mainMenu()
    }
  );
});

/* =========================================================
   البرامج
========================================================= */

bot.action("programs", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
    `📚 *البرامج التعليمية*

اختر البرنامج الذي تريد معرفة تفاصيله:`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📖 القاعدة النورانية", "program_norania")],
        [
          Markup.button.callback("🕌 التلاوة والنظر", "program_nazr"),
          Markup.button.callback("📕 الحفظ", "program_hifz")
        ],
        [Markup.button.callback("🎓 حفص والإجازة", "program_hafs")],
        [Markup.button.callback("📚 القراءات السبع", "program_seven")],
        [Markup.button.callback("📚 القراءات العشر", "program_ten")],
        [Markup.button.callback("🔙 القائمة الرئيسية", "home")]
      ])
    }
  );
});

/* =========================================================
   تفاصيل البرامج
========================================================= */

bot.action("program_norania", async (ctx) => {
  await ctx.answerCbQuery();

  const student = getStudent(ctx);
  student.program = "القاعدة النورانية";

  await ctx.editMessageText(
    `📖 *برنامج القاعدة النورانية*

برنامج تأسيسي للمبتدئين في قراءة القرآن الكريم.

يشمل:

1️⃣ الحروف الهجائية
2️⃣ الحركات
3️⃣ التنوين
4️⃣ المدود
5️⃣ السكون
6️⃣ الشدة
7️⃣ اللام الشمسية والقمرية
8️⃣ الكلمات والتراكيب
9️⃣ التدريب على القراءة

📚 البرنامج يتدرج في الدروس حتى إتقان أساسيات القراءة.

اختر من الأسفل:`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📋 الدروس", "norania_lessons")],
        [Markup.button.callback("📅 حجز جلسة", "booking")],
        [Markup.button.callback("🔙 البرامج", "programs")]
      ])
    }
  );
});

bot.action("norania_lessons", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
    `📖 *دروس القاعدة النورانية*

اختر الدرس:

1️⃣ الدرس الأول
2️⃣ الدرس الثاني
3️⃣ الدرس الثالث
4️⃣ الدرس الرابع
5️⃣ الدرس الخامس
6️⃣ الدرس السادس
7️⃣ الدرس السابع
8️⃣ الدرس الثامن

📌 وسيتم إضافة بقية الدروس تباعًا.

اختر الدرس الذي تريد البدء به:`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("1️⃣", "lesson_1"),
          Markup.button.callback("2️⃣", "lesson_2"),
          Markup.button.callback("3️⃣", "lesson_3")
        ],
        [
          Markup.button.callback("4️⃣", "lesson_4"),
          Markup.button.callback("5️⃣", "lesson_5"),
          Markup.button.callback("6️⃣", "lesson_6")
        ],
        [Markup.button.callback("7️⃣", "lesson_7"), Markup.button.callback("8️⃣", "lesson_8")],
        [Markup.button.callback("🔙 رجوع", "program_norania")]
      ])
    }
  );
});

bot.action(/^lesson_(.+)$/, async (ctx) => {
  await ctx.answerCbQuery();

  const lesson = ctx.match[1];

  await ctx.editMessageText(
    `📖 *الدرس ${lesson}*

يمكنك دراسة هذا الدرس مع أحد المقرئين.

🎧 الاستماع
📖 القراءة
👨‍🏫 التصحيح المباشر

اختر الإجراء:`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📅 حجز مع شيخ", "booking")],
        [Markup.button.callback("🔙 الدروس", "norania_lessons")]
      ])
    }
  );
});

/* =========================================================
   البرامج الأخرى
========================================================= */

function simpleProgram(ctx, title, description, programName, back = "programs") {
  const student = getStudent(ctx);
  student.program = programName;

  return ctx.editMessageText(
    `${title}

${description}

يمكنك اختيار شيخ وحجز جلسة مباشرة.`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("👨‍🏫 اختيار الشيخ", "teachers")],
        [Markup.button.callback("📅 حجز جلسة", "booking")],
        [Markup.button.callback("🔙 رجوع", back)]
      ])
    }
  );
}

bot.action("program_nazr", async (ctx) => {
  await ctx.answerCbQuery();

  await simpleProgram(
    ctx,
    "🕌 *برنامج التلاوة والنظر*",
    "برنامج لتصحيح قراءة القرآن الكريم، وضبط مخارج الحروف، وتحسين الأداء.",
    "التلاوة والنظر"
  );
});

bot.action("program_hifz", async (ctx) => {
  await ctx.answerCbQuery();

  await simpleProgram(
    ctx,
    "📕 *برنامج حفظ القرآن الكريم*",
    "برنامج تدريجي للحفظ والمراجعة والمتابعة مع المقرئ.",
    "الحفظ"
  );
});

bot.action("program_hafs", async (ctx) => {
  await ctx.answerCbQuery();

  await simpleProgram(
    ctx,
    "🎓 *برنامج حفص والإجازة*",
    "مسار متكامل في رواية حفص عن عاصم، مع التلاوة والتجويد والعرض على الشيخ، وصولًا إلى الإجازة عند استكمال المتطلبات.",
    "حفص والإجازة"
  );
});

bot.action("program_seven", async (ctx) => {
  await ctx.answerCbQuery();

  await simpleProgram(
    ctx,
    "📚 *برنامج القراءات السبع*",
    "مسار متدرج لدراسة القراءات السبع وأصولها وفرشها، مع إمكانية تخصيص مسار الجمع.",
    "القراءات السبع"
  );
});

bot.action("program_ten", async (ctx) => {
  await ctx.answerCbQuery();

  await simpleProgram(
    ctx,
    "📚 *برنامج القراءات العشر*",
    "برنامج متخصص في القراءات العشر، وفق مستويات دراسية متدرجة.",
    "القراءات العشر"
  );
});

/* =========================================================
   الشيوخ
========================================================= */

bot.action("teachers", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
    `👨‍🏫 *الشيوخ والمقرئون*

اختر المقرئ الذي تريد معرفة تفاصيله:`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🟢 المقرئ أبو زيد خالد أحمد الولادي", "teacher_abuzaid")],
        [Markup.button.callback("👨‍🏫 مقرئون آخرون", "other_teachers")],
        [Markup.button.callback("🔙 الرئيسية", "home")]
      ])
    }
  );
});

bot.action("teacher_abuzaid", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
    `👨‍🏫 *المقرئ أبو زيد خالد أحمد الولادي*

🟢 متاح للتدريس

📖 التخصصات:
• التلاوة والتصحيح
• التجويد
• رواية حفص
• الحفظ
• الإقراء والإجازة بالسند
• برامج القراءات

يمكنك حجز جلسة مباشرة حسب المواعيد المتاحة.`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📅 حجز جلسة", "booking")],
        [Markup.button.callback("🔙 الشيوخ", "teachers")]
      ])
    }
  );
});

bot.action("other_teachers", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
    `👨‍🏫 *المقرئون*

سيتم إضافة المقرئين وتخصصاتهم ومواعيدهم من لوحة الإدارة.

📌 يمكن لاحقًا أن يظهر لكل شيخ:

• الصورة
• التخصص
• الخبرة
• اللغات
• المواعيد
• حالة الاتصال 🟢🔴`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🔙 الشيوخ", "teachers")]
      ])
    }
  );
});

/* =========================================================
   رصيد الدقائق
========================================================= */

bot.action("balance", async (ctx) => {
  await ctx.answerCbQuery();

  const student = getStudent(ctx);

  await ctx.editMessageText(
    `⏱️ *رصيد الدقائق*

👤 الطالب: ${student.firstName}

━━━━━━━━━━━━

⏱️ الدقائق المتبقية:
*${student.minutes} دقيقة*

💰 القيمة:
*${student.minutes * 5} ETB*

━━━━━━━━━━━━

💡 سعر الدقيقة:
1 دقيقة = 5 ETB`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("💳 شراء دقائق", "packages")],
        [Markup.button.callback("📊 سجل الدقائق", "history")],
        [Markup.button.callback("📅 حجز جلسة", "booking")],
        [Markup.button.callback("🔙 الرئيسية", "home")]
      ])
    }
  );
});

/* =========================================================
   سجل الدقائق
========================================================= */

bot.action("history", async (ctx) => {
  await ctx.answerCbQuery();

  const student = getStudent(ctx);

  if (student.history.length === 0) {
    await ctx.editMessageText(
      `📊 *سجل الدقائق*

لا توجد عمليات حتى الآن.

رصيدك الحالي:
⏱️ ${student.minutes} دقيقة`,
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("💳 شراء دقائق", "packages")],
          [Markup.button.callback("🔙 رصيد الدقائق", "balance")]
        ])
      }
    );

    return;
  }

  let text = "📊 *سجل الدقائق*\n\n";

  student.history
    .slice(-10)
    .reverse()
    .forEach((item) => {
      const sign = item.type === "credit" ? "+" : "-";

      text += `${item.date}\n`;
      text += `${item.description}\n`;
      text += `${sign}${item.minutes} دقيقة\n`;
      text += "────────────\n";
    });

  text += `\n⏱️ الرصيد الحالي: *${student.minutes} دقيقة*`;

  await ctx.editMessageText(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard([
      [Markup.button.callback("🔙 رصيد الدقائق", "balance")]
    ])
  });
});

/* =========================================================
   الباقات
========================================================= */

bot.action("packages", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
    `💳 *شراء الدقائق*

سعر الدقيقة الأساسي:
⏱️ 1 دقيقة = 5 ETB

اختر الباقة:`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("100 دقيقة — 500 ETB", "buy_100")],
        [Markup.button.callback("200 دقيقة — 1,000 ETB", "buy_200")],
        [Markup.button.callback("300 دقيقة — 1,470 ETB", "buy_300")],
        [Markup.button.callback("400 دقيقة — 1,920 ETB", "buy_400")],
        [Markup.button.callback("500 دقيقة — 2,350 ETB", "buy_500")],
        [Markup.button.callback("600 دقيقة — 2,760 ETB", "buy_600")],
        [Markup.button.callback("1,000 دقيقة — 4,500 ETB", "buy_1000")],
        [Markup.button.callback("🔙 الرئيسية", "home")]
      ])
    }
  );
});

/* =========================================================
   اختيار باقة
========================================================= */

bot.action(/^buy_(\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();

  const minutes = Number(ctx.match[1]);
  const pack = packages.find((p) => p.minutes === minutes);

  if (!pack) {
    return ctx.reply("❌ الباقة غير موجودة.");
  }

  await ctx.editMessageText(
    `💳 *تأكيد الباقة*

⏱️ الدقائق: ${pack.minutes}
💰 السعر: ${pack.price} ETB

بعد الدفع سيتم اعتماد الدقائق في حسابك بعد مراجعة الإدارة.

اختر:`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "💰 أريد شراء هذه الباقة",
            `confirm_${pack.minutes}`
          )
        ],
        [Markup.button.callback("🔙 الباقات", "packages")]
      ])
    }
  );
});

/* =========================================================
   تأكيد طلب الشراء
========================================================= */

bot.action(/^confirm_(\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();

  const minutes = Number(ctx.match[1]);
  const pack = packages.find((p) => p.minutes === minutes);

  await ctx.editMessageText(
    `✅ *تم تسجيل طلب الشراء*

الباقة:
⏱️ ${pack.minutes} دقيقة

المبلغ:
💰 ${pack.price} ETB

📌 الخطوة التالية:

أرسل إيصال الدفع إلى إدارة المقرأة، وبعد التحقق سيتم إضافة الدقائق إلى رصيدك.

🔐 لا يتم إضافة الدقائق إلا بعد اعتماد الإدارة.`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📞 التواصل مع الإدارة", "support")],
        [Markup.button.callback("🔙 الرئيسية", "home")]
      ])
    }
  );
});

/* =========================================================
   حجز جلسة
========================================================= */

bot.action("booking", async (ctx) => {
  await ctx.answerCbQuery();

  const student = getStudent(ctx);

  if (student.minutes <= 0) {
    await ctx.editMessageText(
      `⚠️ *لا يوجد لديك رصيد دقائق كافٍ.*

رصيدك الحالي:
⏱️ ${student.minutes} دقيقة

للحجز يجب أن يكون لديك رصيد.`,
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          [Markup.button.callback("💳 شراء دقائق", "packages")],
          [Markup.button.callback("🔙 الرئيسية", "home")]
        ])
      }
    );

    return;
  }

  await ctx.editMessageText(
    `📅 *حجز جلسة*

رصيدك:
⏱️ ${student.minutes} دقيقة

اختر مدة الجلسة:`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback("15 دقيقة", "book_15"),
          Markup.button.callback("20 دقيقة", "book_20")
        ],
        [
          Markup.button.callback("30 دقيقة", "book_30"),
          Markup.button.callback("45 دقيقة", "book_45")
        ],
        [Markup.button.callback("60 دقيقة", "book_60")],
        [Markup.button.callback("🔙 الرئيسية", "home")]
      ])
    }
  );
});

/* =========================================================
   تأكيد مدة الحجز
========================================================= */

bot.action(/^book_(\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();

  const minutes = Number(ctx.match[1]);
  const student = getStudent(ctx);

  if (student.minutes < minutes) {
    await ctx.editMessageText(
      `❌ لا يكفي رصيدك لهذه الجلسة.

رصيدك الحالي:
⏱️ ${student.minutes} دقيقة

مدة الجلسة المطلوبة:
⏱️ ${minutes} دقيقة`,
      {
        ...Markup.inlineKeyboard([
          [Markup.button.callback("💳 شراء دقائق", "packages")],
          [Markup.button.callback("🔙 الحجز", "booking")]
        ])
      }
    );

    return;
  }

  await ctx.editMessageText(
    `📅 *اختيار موعد الجلسة*

مدة الجلسة:
⏱️ ${minutes} دقيقة

اختر الفترة:`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🌅 صباحًا", `time_${minutes}_morning`)],
        [Markup.button.callback("☀️ بعد الظهر", `time_${minutes}_afternoon`)],
        [Markup.button.callback("🌙 مساءً", `time_${minutes}_night`)],
        [Markup.button.callback("🔙 رجوع", "booking")]
      ])
    }
  );
});

/* =========================================================
   اختيار الوقت
========================================================= */

bot.action(/^time_(\d+)_(.+)$/, async (ctx) => {
  await ctx.answerCbQuery();

  const minutes = Number(ctx.match[1]);
  const period = ctx.match[2];

  let periodName = "🌙 مساءً";

  if (period === "morning") periodName = "🌅 صباحًا";
  if (period === "afternoon") periodName = "☀️ بعد الظهر";

  await ctx.editMessageText(
    `📅 *طلب حجز جلسة*

👨‍🏫 المقرئ:
أبو زيد خالد أحمد الولادي

⏱️ المدة:
${minutes} دقيقة

🕐 الفترة:
${periodName}

📌 سيتم اختيار الموعد النهائي حسب جدول المقرئ وتوفره.

هل تريد إرسال طلب الحجز؟`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "✅ إرسال طلب الحجز",
            `confirmbook_${minutes}`
          )
        ],
        [Markup.button.callback("❌ إلغاء", "booking")]
      ])
    }
  );
});

/* =========================================================
   تأكيد الحجز وخصم الدقائق
========================================================= */

bot.action(/^confirmbook_(\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();

  const minutes = Number(ctx.match[1]);
  const student = getStudent(ctx);

  if (student.minutes < minutes) {
    return ctx.reply("❌ الرصيد غير كافٍ.");
  }

  student.minutes -= minutes;

  addHistory(
    student,
    "debit",
    minutes,
    `حجز جلسة قراءة لمدة ${minutes} دقيقة`
  );

  await ctx.editMessageText(
    `✅ *تم إرسال طلب الحجز بنجاح*

👨‍🏫 المقرئ:
أبو زيد خالد أحمد الولادي

⏱️ مدة الجلسة:
${minutes} دقيقة

💳 تم حجز:
${minutes} دقيقة من رصيدك

⏱️ الرصيد المتبقي:
${student.minutes} دقيقة

📌 ستظهر لك تفاصيل الموعد عند اعتماد الحجز.`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("⏱️ رصيدي", "balance")],
        [Markup.button.callback("🔙 الرئيسية", "home")]
      ])
    }
  );
});

/* =========================================================
   حساب الطالب
========================================================= */

bot.action("account", async (ctx) => {
  await ctx.answerCbQuery();

  const student = getStudent(ctx);

  await ctx.editMessageText(
    `👤 *حسابي*

الاسم:
${student.firstName}

Telegram ID:
${student.telegramId}

اسم المستخدم:
${student.username ? "@" + student.username : "غير موجود"}

━━━━━━━━━━━━

⏱️ رصيد الدقائق:
${student.minutes}

📚 البرنامج:
${student.program || "لم يتم اختيار برنامج"}`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📚 اختيار برنامج", "programs")],
        [Markup.button.callback("⏱️ رصيد الدقائق", "balance")],
        [Markup.button.callback("📊 السجل", "history")],
        [Markup.button.callback("🔙 الرئيسية", "home")]
      ])
    }
  );
});

/* =========================================================
   الشهادات والإجازات
========================================================= */

bot.action("certificates", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
    `📜 *الإجازات والشهادات*

بعد إكمال المتطلبات العلمية للبرنامج، يمكن أن تشمل الخدمات:

🎓 شهادة إتمام البرنامج
📜 شهادة حفظ
📖 إجازة في الرواية
🕌 إجازة بالقراءة
📚 سند الإجازة

تخضع الإجازة وشروطها لتقييم المقرئ وإدارة المقرأة.`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("📚 البرامج", "programs")],
        [Markup.button.callback("🔙 الرئيسية", "home")]
      ])
    }
  );
});

/* =========================================================
   الكتب
========================================================= */

bot.action("books", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
    `📚 *الكتب والمصاحف*

سيتم توفير مكتبة رقمية تشمل:

📖 القرآن الكريم
📘 القاعدة النورانية
📗 الجزرية
📙 تحفة الأطفال
📕 الشاطبية
📚 كتب التجويد والقراءات

اختر الكتاب من المكتبة عند توفره.`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🔙 الرئيسية", "home")]
      ])
    }
  );
});

/* =========================================================
   الصوتيات
========================================================= */

bot.action("audio", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
    `🎧 *المكتبة الصوتية*

سيتم إضافة:

🎙️ تلاوات المقرئين
📖 دروس التجويد
🎓 دروس القراءات
🕌 تصحيح التلاوة
📚 شرح المتون

وسيتم لاحقًا تنظيمها حسب البرنامج والمستوى.`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🔙 الرئيسية", "home")]
      ])
    }
  );
});

/* =========================================================
   الدعم
========================================================= */

bot.action("support", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
    `📞 *الدعم والمساعدة*

إذا واجهت مشكلة في:

• التسجيل
• الدقائق
• الدفع
• الحجز
• البرامج
• الإجازة

تواصل مع إدارة المقرأة.

📧 البريد:
khdahd241@gmail.com

📱 Telegram:
@aljezer\\_241`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.url(
            "💬 التواصل عبر Telegram",
            "https://t.me/aljezer_241"
          )
        ],
        [Markup.button.callback("🔙 الرئيسية", "home")]
      ])
    }
  );
});

/* =========================================================
   العودة للرئيسية
========================================================= */

bot.action("home", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.editMessageText(
    `📖 *مقرأة الإمام الجزري*

أهلاً بك من جديد 🌿

اختر الخدمة التي تريدها:`,
    {
      parse_mode: "Markdown",
      ...mainMenu()
    }
  );
});

/* =========================================================
   أي رسالة نصية
========================================================= */

bot.on("text", async (ctx) => {
  await ctx.reply(
    `🌿 أهلاً بك في مقرأة الإمام الجزري.

استخدم الأزرار الموجودة في القائمة للوصول إلى الخدمات 👇`,
    mainMenu()
  );
});

/* =========================================================
   أخطاء البوت
========================================================= */

bot.catch((err, ctx) => {
  console.error("Bot Error:", err);

  try {
    ctx.reply("⚠️ حدث خطأ مؤقت. حاول مرة أخرى بعد قليل.");
  } catch (e) {
    console.error(e);
  }
});

/* =========================================================
   خادم Render
========================================================= */

app.get("/", (req, res) => {
  res.send(`
    <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>مقرأة الإمام الجزري</title>
      </head>
      <body style="font-family:Arial;text-align:center;padding:50px">
        <h1>📖 مقرأة الإمام الجزري</h1>
        <p>🤖 بوت المقرأة يعمل بنجاح</p>
        <p>الإقراء والإجازة بالسند</p>
      </body>
    </html>
  `);
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    bot: "Imam Al-Jazari Bot"
  });
});

/* =========================================================
   تشغيل السيرفر والبوت
========================================================= */

app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);
});

bot
  .launch()
  .then(() => {
    console.log("🤖 Imam Al-Jazari Bot is running...");
  })
  .catch((error) => {
    console.error("❌ Failed to start bot:", error);
  });

/* =========================================================
   إيقاف آمن
========================================================= */

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
