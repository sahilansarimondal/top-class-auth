import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

const prisma = new PrismaClient();

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    AzureADProvider({
      name: "Microsoft",
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    }),
    {
      id: "steam",
      name: "Steam",
      type: "oauth",
      authorization: {
        url: "https://steamcommunity.com/openid/login",
        params: {
          "openid.ns": "http://specs.openid.net/auth/2.0",
          "openid.mode": "checkid_setup",
          "openid.return_to": `${process.env.HOST_NAME}/api/v1/auth/callback/steam`,
          "openid.realm": `${process.env.HOST_NAME}`,
          "openid.identity":
            "http://specs.openid.net/auth/2.0/identifier_select",
          "openid.claimed_id":
            "http://specs.openid.net/auth/2.0/identifier_select",
        },
      },
      token: {
        async request(ctx) {
          const token_params = {
            "openid.assoc_handle": req.query["openid.assoc_handle"],
            "openid.signed": req.query["openid.signed"],
            "openid.sig": req.query["openid.sig"],
            "openid.ns": "http://specs.openid.net/auth/2.0",
            "openid.mode": "check_authentication",
          };
          for (const val of req.query["openid.signed"].split(",")) {
            //@ts-ignore
            token_params[`openid.${val}`] = req.query[`openid.${val}`];
          }
          const token_url = new URL("https://steamcommunity.com/openid/login");
          const token_url_params = new URLSearchParams(token_params);
          //@ts-ignore
          token_url.search = token_url_params;
          const token_res = await fetch(token_url, {
            method: "POST",
            headers: {
              "Accept-language": "en\r\n",
              "Content-type": "application/x-www-form-urlencoded\r\n",
              "Content-Length": `${token_url_params.toString().length}\r\n`,
            },
            body: token_url_params.toString(),
          });
          const result = await token_res.text();
          if (result.match(/is_valid\s*:\s*true/i)) {
            let matches = req.query["openid.claimed_id"].match(
              /^https:\/\/steamcommunity.com\/openid\/id\/([0-9]{17,25})/
            );
            const steamid = matches[1].match(/^-?\d+$/) ? matches[1] : 0;
            const tokenset = new TokenSet({
              id_token: uuidv4(),
              access_token: uuidv4(),
              steamid: steamid,
            });
            return { tokens: tokenset };
          } else {
            return { tokens: new TokenSet({}) };
          }
        },
      },
      userinfo: {
        async request(ctx) {
          const user_result = await fetch(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${ctx.provider.clientSecret}&steamids=${ctx.tokens.steamid}`
          );
          const json = await user_result.json();
          return json.response.players[0];
        },
      },
      idToken: false,
      checks: ["none"],
      profile(profile) {
        return {
          id: profile.steamid,
          image: profile.avatarfull,
          name: profile.personaname,
        };
      },
      clientId: "whateveryouwant",
      clientSecret: process.env.STEAM_API,
    },
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    }),

    // ...add more providers here
    // Credentials({
    //   name: "credentials",
    //   credentials: {
    //     email: { label: "Email", type: "text", placeholder: "smith@mail.com" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
    //       method: "POST",
    //       body: JSON.stringify(credentials),
    //       headers: { "Content-Type": "application/json" },
    //     });
    //     const user = await res.json();
    //     if (res.ok && user) {
    //       return user;
    //     }
    //     return null;
    //   },
    // }),
  ],
  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
