require('dotenv').config()
const express = require("express");
const cors = require("cors");
const path = require('path')
const fs = require('fs');
const app = express();
const router = require("./src/modules");
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const localText = require('./src/text/text.json')
const model = require('./model');
const { bot } = require('./src/lib/bot')
const {
   formatBalanceWithSpaces,
   formatDateAdvanced
} = require('./src/lib/functions');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const publicFolderPath = path.join(__dirname, 'public');
const imagesFolderPath = path.join(publicFolderPath, 'images');

if (!fs.existsSync(publicFolderPath)) {
   fs.mkdirSync(publicFolderPath);
   console.log('Public folder created successfully.');
} else {
   console.log('Public folder already exists.');
}

if (!fs.existsSync(imagesFolderPath)) {
   fs.mkdirSync(imagesFolderPath);
   console.log('Images folder created successfully.');
} else {
   console.log('Images folder already exists within the public folder.');
}

// generateInlineKeyboard
const generateInlineKeyboard = async (chatId, page, lang) => {
   const ITEMS_PER_PAGE = 5;
   const offset = page * ITEMS_PER_PAGE;
   const historiesList = await model.historiesList(chatId, offset)
   const historiesCount = await model.historiesCount(chatId)
   const totalCount = parseInt(historiesCount.count ?? 0, 10);
   const buttons = historiesList.map(h => [{
      text: `${h.date_only} - ${h.amount.toLocaleString('en-US')}`,
      callback_data: `history_${h.id}`
   }]);

   const nav = [];
   if (page > 0) nav.push({ text: lang == 'uz' ? localText.previousBtnUz : lang == 'ru' ? localText.previousBtnRu : localText.previousBtnUz, callback_data: `page_${page - 1}` });
   if ((page + 1) * ITEMS_PER_PAGE < totalCount) nav.push({ text: lang == 'uz' ? localText.nextBtnUz : lang == 'ru' ? localText.nextBtnRu : localText.nextBtnUz, callback_data: `page_${page + 1}` });

   if (nav.length) buttons.push(nav);

   return buttons;
}

// BOT
bot.onText(/\/start/, async msg => {
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)

   if (foundUser) {
      if (foundUser.bot_step == "") {

      } else if (foundUser.bot_lang == 'uz') {
         bot.sendMessage(chatId, localText.menuTextUz, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.balanceBtnUz
                     }
                  ],
                  [
                     {
                        text: localText.historiesBtnUz
                     }
                  ],
                  [
                     {
                        text: localText.addressBtnUz
                     },
                     {
                        text: localText.nearAddressBtnUz
                     },
                  ],
                  [
                     {
                        text: localText.changeLangBtnUz
                     },
                  ]
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      } else if (foundUser.bot_lang == 'ru') {
         bot.sendMessage(chatId, localText.menuTextRu, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.balanceBtnRu
                     }
                  ],
                  [
                     {
                        text: localText.historiesBtnRu
                     }
                  ],
                  [
                     {
                        text: localText.addressBtnRu
                     },
                     {
                        text: localText.nearAddressBtnRu
                     },
                  ],
                  [
                     {
                        text: localText.changeLangBtnRu
                     },
                  ]
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
         })
      }
   } else {
      bot.sendMessage(chatId, localText.startText, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: "🇺🇿 UZ"
                  },
                  {
                     text: "🇷🇺 Ру"
                  },
               ]
            ],
            resize_keyboard: true
         }
      })
   }
})

bot.on('message', async msg => {
   const chatId = msg.chat.id;
   const text = msg.text;
   const foundUser = await model.foundUser(chatId)

   if (foundUser && foundUser?.bot_step == 'change_lang') {
      if (text == '🇺🇿 Uz') {
         bot.sendMessage(chatId, localText.menuTextUz, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.balanceBtnUz
                     }
                  ],
                  [
                     {
                        text: localText.historiesBtnUz
                     }
                  ],
                  [
                     {
                        text: localText.addressBtnUz
                     },
                     {
                        text: localText.nearAddressBtnUz
                     },
                  ],
                  [
                     {
                        text: localText.changeLangBtnUz
                     },
                  ]
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
            await model.changeLang(chatId, 'uz')
         })
      } else if (text == '🇷🇺 Ру') {
         bot.sendMessage(chatId, localText.menuTextRu, {
            parse_mode: "HTML",
            reply_markup: {
               keyboard: [
                  [
                     {
                        text: localText.balanceBtnRu
                     }
                  ],
                  [
                     {
                        text: localText.historiesBtnRu
                     }
                  ],
                  [
                     {
                        text: localText.addressBtnRu
                     },
                     {
                        text: localText.nearAddressBtnRu
                     },
                  ],
                  [
                     {
                        text: localText.changeLangBtnRu
                     },
                  ]
               ],
               resize_keyboard: true
            }
         }).then(async () => {
            await model.editStep(chatId, 'menu')
            await model.changeLang(chatId, 'ru')
         })
      }
   } else if (text == '🇺🇿 UZ') {
      bot.sendMessage(chatId, localText.startTextUz, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.sendContactBtnUz,
                     request_contact: true
                  }
               ]
            ],
            resize_keyboard: true
         }
      }).then(async () => {
         const code = uuidv4();
         const qrcode = `./public/images/qrcode_${chatId}.png`;
         await QRCode.toFile(qrcode, code, {
            type: 'svg',
            errorCorrectionLevel: 'H',
         });
         await model.createUser(
            chatId,
            'uz',
            code,
            `qrcode_${chatId}.png`,
            `${process.env.BACKEND_URL}/qrcode_${chatId}.png`,
            'register'
         )
      })
   } else if (text == '🇷🇺 Ру') {
      bot.sendMessage(chatId, localText.startTextRu, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.sendContactBtnRu,
                     request_contact: true
                  }
               ]
            ],
            resize_keyboard: true
         }
      }).then(async () => {
         const code = uuidv4();
         const qrcode = `./public/images/qrcode_${chatId}.png`;
         await QRCode.toFile(qrcode, code);
         await model.createUser(
            chatId,
            'ru',
            code,
            `qrcode_${chatId}.png`,
            `${process.env.BACKEND_URL}/qrcode_${chatId}.png`,
            'register'
         )
      })
   } else if (foundUser?.bot_step == 'ask_name' && text) {
      const addName = await model.addName(chatId, text)

      if (addName) {
         if (addName.bot_lang == 'uz') {
            bot.sendMessage(chatId, localText.successfullyRegisterUz, {
               parse_mode: "HTML",
               reply_markup: {
                  inline_keyboard: [
                     [
                        {
                           text: localText.seeConditionsBtnUz,
                           callback_data: "see_conditions"
                        }
                     ],
                     [
                        {
                           text: localText.agreeConditionsBtnUz,
                           callback_data: "agree_conditions"
                        }
                     ]
                  ]
               }
            }).then(async () => {
               await model.editStep(chatId, 'conditions')
            })
         } else if (addName.bot_lang == 'ru') {
            bot.sendMessage(chatId, localText.successfullyRegisterRu, {
               parse_mode: "HTML",
               reply_markup: {
                  inline_keyboard: [
                     [
                        {
                           text: localText.seeConditionsBtnRu,
                           callback_data: "see_conditions"
                        }
                     ],
                     [
                        {
                           text: localText.agreeConditionsBtnRu,
                           callback_data: "agree_conditions"
                        }
                     ]
                  ]
               }
            }).then(async () => {
               await model.editStep(chatId, 'conditions')
            })
         }
      }
   } else if (text == localText.balanceBtnUz) {
      const caption = localText.balanceTextUz.replace(/%balance%/g, foundUser.balance.toLocaleString('en-US'))
      bot.sendPhoto(chatId, `./public/images/${foundUser.qrcode_image}`, {
         parse_mode: "HTML",
         caption: caption
      })
   } else if (text == localText.balanceBtnRu) {
      const caption = localText.balanceTextRu.replace(/%balance%/g, foundUser.balance.toLocaleString('en-US'))
      bot.sendPhoto(chatId, `./public/images/${foundUser.qrcode_image}`, {
         parse_mode: "HTML",
         caption: caption
      })
   } else if (text == localText.historiesBtnUz) {
      const inlineBtns = await generateInlineKeyboard(chatId, 0, 'uz')
      bot.sendMessage(chatId, localText.historiesListTextUz, {
         parse_mode: "HTML",
         reply_markup: {
            inline_keyboard: inlineBtns
         }
      }).then(async () => {
         await model.editStep(chatId, 'histories')
      })
   } else if (text == localText.historiesBtnRu) {
      const inlineBtns = await generateInlineKeyboard(chatId, 0, 'ru')
      bot.sendMessage(chatId, localText.historiesListTextRu, {
         parse_mode: "HTML",
         reply_markup: {
            inline_keyboard: inlineBtns
         }
      }).then(async () => {
         await model.editStep(chatId, 'histories')
      })
   } else if (text == localText.addressBtnUz) {
      const branches = await model.branches('uz')

      branches?.forEach(b => {
         const phoneNumbers = b?.phone_number?.join(', ')
         const text = localText.addressTextUz
            .replace(/%name%/g, b.name)
            .replace(/%phone_number%/g, phoneNumbers)
            .replace(/%schedule%/g, b.schedule)
            .replace(/%address%/g, b.address)
            .replace(/%landmark%/g, b.landmark)
            .replace(/%map%/g, b.address_link);

         setTimeout(() => {
            bot.sendPhoto(chatId, `./public/images/${b.image_name}`, {
               parse_mode: "HTML",
               caption: text
            })
         }, 2000);
      });
   } else if (text == localText.addressBtnRu) {
      const branches = await model.branches('ru')

      branches?.forEach(b => {
         const phoneNumbers = b?.phone_number?.join(', ')
         const text = localText.addressTextRu
            .replace(/%name%/g, b.name)
            .replace(/%phone_number%/g, phoneNumbers)
            .replace(/%schedule%/g, b.schedule)
            .replace(/%address%/g, b.address)
            .replace(/%landmark%/g, b.landmark)
            .replace(/%map%/g, b.address_link);

         setTimeout(() => {
            bot.sendPhoto(chatId, `./public/images/${b.image_name}`, {
               parse_mode: "HTML",
               caption: text
            })
         }, 2000);
      });
   } else if (text == localText.nearAddressBtnUz) {
      bot.sendMessage(chatId, localText.nearAddressTextUz, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.sendLocationBtnUz,
                     request_location: true
                  }
               ]
            ],
            resize_keyboard: true
         }
      })
   } else if (text == localText.nearAddressBtnRu) {
      bot.sendMessage(chatId, localText.nearAddressTextRu, {
         parse_mode: "HTML",
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.sendLocationBtnRu,
                     request_location: true
                  }
               ]
            ],
            resize_keyboard: true
         }
      })
   } else if (text == localText.changeLangBtnUz) {
      bot.sendMessage(chatId, localText.changeLangTextUz, {
         reply_markup: {
            keyboard: [
               [
                  {
                     text: '🇺🇿 Uz',
                  },
                  {
                     text: '🇷🇺 Ру',
                  }
               ],
            ],
            resize_keyboard: true,
         }
      }).then(async () => {
         await model.editStep(chatId, 'change_lang')
      })
   } else if (text == localText.changeLangBtnRu) {
      bot.sendMessage(chatId, localText.changeLangTextRu, {
         reply_markup: {
            keyboard: [
               [
                  {
                     text: '🇺🇿 Uz',
                  },
                  {
                     text: '🇷🇺 Ру',
                  }
               ],
            ],
            resize_keyboard: true,
         }
      }).then(async () => {
         await model.editStep(chatId, 'change_lang')
      })
   }
})

bot.on('contact', async msg => {
   const chatId = msg.chat.id;
   const foundUser = await model.foundUser(chatId)
   let phoneNumber = `+${(msg.contact.phone_number || '').trim().replace(/^(\+|0+)/, '')}`;

   if (msg.contact && foundUser?.bot_step == 'register') {
      if (msg.contact.user_id !== msg.from.id) {
         if (foundUser.bot_lang == 'uz') {
            return bot.sendMessage(chatId, localText.contactRegisterErrorUz, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [{
                        text: localText.sendContactBtnUz,
                        request_contact: true
                     }]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true
               }
            })
         } else if (foundUser.bot_lang == 'ru') {
            return bot.sendMessage(chatId, localText.contactRegisterErrorRu, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [{
                        text: localText.sendContactBtnRu,
                        request_contact: true
                     }]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true
               }
            })
         }
      }

      const addPhoneUser = await model.addPhoneUser(chatId, phoneNumber)

      if (addPhoneUser) {
         if (addPhoneUser.bot_lang == 'uz') {
            bot.sendMessage(chatId, localText.askNameTextUz, {
               parse_mode: "HTML",
               reply_markup: {
                  remove_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'ask_name')
            })
         } else if (addPhoneUser.bot_lang == 'ru') {
            bot.sendMessage(chatId, localText.askNameTextRu, {
               parse_mode: "HTML",
               reply_markup: {
                  remove_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'ask_name')
            })
         }
      }
   }
})

bot.on("callback_query", async msg => {
   const chatId = msg.message.chat.id;
   const data = msg.data;
   const foundUser = await model.foundUser(chatId)

   if (data == "see_conditions") {

   } else if (data == "agree_conditions") {
      if (foundUser.bot_lang == 'uz') {
         const caption = localText.balanceTextUz.replace(/%balance%/g, foundUser.balance.toLocaleString('en-US'))
         bot.sendPhoto(chatId, `./public/images/${foundUser.qrcode_image}`, {
            parse_mode: "HTML",
            caption: caption
         }).then(async () => {
            bot.sendMessage(chatId, localText.menuTextUz, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.balanceBtnUz
                        }
                     ],
                     [
                        {
                           text: localText.historiesBtnUz
                        }
                     ],
                     [
                        {
                           text: localText.addressBtnUz
                        },
                        {
                           text: localText.nearAddressBtnUz
                        },
                     ],
                     [
                        {
                           text: localText.changeLangBtnUz
                        },
                     ]
                  ],
                  resize_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'menu')
            })
         })
      } else if (foundUser.bot_lang == 'ru') {
         const caption = localText.balanceTextRu.replace(/%balance%/g, foundUser.balance.toLocaleString('en-US'))
         bot.sendPhoto(chatId, `./public/images/${foundUser.qrcode_image}`, {
            parse_mode: "HTML",
            caption: caption
         }).then(async () => {
            bot.sendMessage(chatId, localText.menuTextRu, {
               parse_mode: "HTML",
               reply_markup: {
                  keyboard: [
                     [
                        {
                           text: localText.balanceBtnRu
                        }
                     ],
                     [
                        {
                           text: localText.historiesBtnRu
                        }
                     ],
                     [
                        {
                           text: localText.addressBtnRu
                        },
                        {
                           text: localText.nearAddressBtnRu
                        },
                     ],
                     [
                        {
                           text: localText.changeLangBtnRu
                        },
                     ]
                  ],
                  resize_keyboard: true
               }
            }).then(async () => {
               await model.editStep(chatId, 'menu')
            })
         })
      }
   } else if (data.startsWith("page_")) {
      const messageId = msg.message.message_id;
      const page = parseInt(data.split("_")[1], 10);
      const keyboard = await generateInlineKeyboard(chatId, page);

      bot.editMessageReplyMarkup(keyboard.reply_markup, {
         chat_id: chatId,
         message_id: messageId
      });
   } else if (data.startsWith('history_')) {
      const id = parseInt(data.split("_")[1], 10);

      if (foundUser.bot_lang == 'uz') {
         const foundhistory = await model.foundhistory(id, 'uz')
         const replaceText = localText.historiesTextUz
            .replace(/%date%/g, foundhistory.date)
            .replace(/%amount%/g, foundhistory.amount.toLocaleString('en-US'))
            .replace(/%name%/g, foundhistory.name)
         const text = `${replaceText}\n\n${foundhistory?.items.map((item, index) => `${++index}. ${item.name} - ${item.qty} ta - ${item.price.toLocaleString('en-US')} so'm`).join('\n')}`
         bot.sendMessage(chatId, text, { parse_mode: "HTML" })
      } else if (foundUser.bot_lang == 'ru') {
         const foundhistory = await model.foundhistory(id, 'ru')
         const replaceText = localText.historiesTextRu
            .replace(/%date%/g, foundhistory.date)
            .replace(/%amount%/g, foundhistory.amount.toLocaleString('en-US'))
            .replace(/%name%/g, foundhistory.name)
         const text = `${replaceText}\n\n${foundhistory.itmes.map((item, index) => `${++index}. ${item.name} - ${item.qty} шт. - ${item.price.toLocaleString('en-US')} сум`).join('\n')}`
         bot.sendMessage(chatId, text, { parse_mode: "HTML" })
      }
   }
})

bot.on('location', async msg => {
   const chatId = msg.chat.id;
   const location = msg.location;
   const userLatitude = location.latitude
   const userLongitude = location.longitude
   const foundUser = await model.foundUser(chatId)

   if (foundUser?.bot_lang == 'uz') {
      const foundnearBranch = await model.foundnearBranch(userLatitude, userLongitude, 'uz')
      const phoneNumbers = foundnearBranch?.phone_number?.join(', ')
      const text = localText.addressTextUz
         .replace(/%name%/g, foundnearBranch.name)
         .replace(/%phone_number%/g, phoneNumbers)
         .replace(/%schedule%/g, foundnearBranch.schedule)
         .replace(/%address%/g, foundnearBranch.address)
         .replace(/%landmark%/g, foundnearBranch.landmark)
         .replace(/%map%/g, foundnearBranch.address_link);

      bot.sendPhoto(chatId, `./public/images/${foundnearBranch.image_name}`, {
         parse_mode: "HTML",
         caption: text,
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.balanceBtnUz
                  }
               ],
               [
                  {
                     text: localText.historiesBtnUz
                  }
               ],
               [
                  {
                     text: localText.addressBtnUz
                  },
                  {
                     text: localText.nearAddressBtnUz
                  },
               ],
               [
                  {
                     text: localText.changeLangBtnUz
                  },
               ]
            ],
            resize_keyboard: true
         }
      })

   } else if (foundUser?.bot_lang == 'ru') {
      const foundnearBranch = await model.foundnearBranch(userLatitude, userLongitude, 'ru')
      const phoneNumbers = foundnearBranch?.phone_number?.join(', ')
      const text = localText.addressTextRu
         .replace(/%name%/g, foundnearBranch.name)
         .replace(/%phone_number%/g, phoneNumbers)
         .replace(/%schedule%/g, foundnearBranch.schedule)
         .replace(/%address%/g, foundnearBranch.address)
         .replace(/%landmark%/g, foundnearBranch.landmark)
         .replace(/%map%/g, foundnearBranch.address_link);

      bot.sendPhoto(chatId, `./public/images/${foundnearBranch.image_name}`, {
         parse_mode: "HTML",
         caption: text,
         reply_markup: {
            keyboard: [
               [
                  {
                     text: localText.balanceBtnRu
                  }
               ],
               [
                  {
                     text: localText.historiesBtnRu
                  }
               ],
               [
                  {
                     text: localText.addressBtnRu
                  },
                  {
                     text: localText.nearAddressBtnRu
                  },
               ],
               [
                  {
                     text: localText.changeLangBtnRu
                  },
               ]
            ],
            resize_keyboard: true
         }
      })
   }

})

const options = {
   definition: {
      openapi: "3.0.0",
      info: {
         title: "MegaFarm API documentation",
         version: "1.0.0",
         description: "by Diyor Jaxongirov",
      },
      servers: [
         {
            url: "https://srvr.megafarm.uz/api/v1"
         }
      ]
   },
   apis: ["./src/modules/index.js"],
};

const specs = swaggerJsDoc(options);

app.use(cors({
   origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({
   extended: true
}));
app.use('/public', express.static(path.resolve(__dirname, 'public')))
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/api/v1", router);

app.listen(4240, console.log(4240))
