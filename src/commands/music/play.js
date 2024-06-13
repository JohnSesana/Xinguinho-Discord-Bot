import { ApplicationCommandOptionType } from "discord.js";
import { useMainPlayer, QueryType } from "discord-player";
import { BaseEmbed, ErrorEmbed } from "../../modules/Embeds.js";
import playerOptions from "../../config/playerOptions.js";

export const data = {
  name: "play",
  description: "Toque uma música à partir de um link ou nome.",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "query",
      description: "Nome ou link da música para tocar",
      required: true,
      min_length: 1,
      max_length: 256,
      autocomplete: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "source",
      description: "Applicativo para procurar a música",
      choices: [
        {
          name: "YouTube",
          value: QueryType.YOUTUBE_SEARCH,
        },
        {
          name: "SoundCloud",
          value: QueryType.SOUNDCLOUD_SEARCH,
        },
        {
          name: "Spotify",
          value: QueryType.SPOTIFY_SEARCH,
        },
        {
          name: "Apple Music",
          value: QueryType.APPLE_MUSIC_SEARCH,
        },
      ],
    },
  ],
  category: "music",
  validateVC: true,
};

export async function suggest(interaction) {
  const query = interaction.options.getString("query", false)?.trim();
  if (!query) return;

  const player = useMainPlayer();
  const searchResult = await player.search(query).catch(() => null);
  if (!searchResult) {
    return interaction.respond([
      { name: "Nenhuma música encontrada.", value: "" },
    ]);
  }

  const tracks = searchResult.hasPlaylist()
    ? searchResult.playlist.tracks.slice(0, 24)
    : searchResult.tracks.slice(0, 10);

  const formattedResult = tracks.map((track) => ({
    name: track.title,
    value: track.url,
  }));

  if (searchResult.hasPlaylist()) {
    formattedResult.unshift({
      name: `Playlist | ${searchResult.playlist.title}`,
      value: searchResult.playlist.url,
    });
  }

  return interaction.respond(formattedResult);
}

export async function execute(interaction) {
  const channel = interaction.member?.voice?.channel;
  const checks = [
    {
      condition: !channel,
      message: "Você precisa estar em um canal de voz antes.",
    },
    {
      condition: !channel.viewable,
      message: "Eu preciso da permissão `View Channel`.",
    },
    {
      condition: !channel.speakable,
      message: "Eu preciso da permissão `Speak Channel`.",
    },
    {
      condition: !channel.joinable,
      message: "Eu preciso da permissão `Connect Channel`.",
    },
    {
      condition: channel.full,
      message: "Erro: O canal de voz está cheio.",
    },
    {
      condition: interaction.member.voice.deaf,
      message:
        "Você não pode executar esse comando enquanto estiver surdo no servidor",
    },
    {
      condition: interaction.guild.members.me?.voice?.mute,
      message: "Por favor me desmute antes de tocar",
    },
  ];

  for (const check of checks) {
    if (check.condition)
      return interaction.reply({
        ephemeral: true,
        embeds: [ErrorEmbed(check.message)],
      });
  }

  const query = interaction.options.getString("query", true);
  const searchEngine =
    interaction.options.getString("source", false) ?? QueryType.AUTO;
  const player = useMainPlayer();

  await interaction.deferReply();

  const result = await player.search(query, {
    searchEngine,
    requestedBy: interaction.user,
  });

  if (!result.hasTracks())
    return interaction.editReply({
      embeds: [ErrorEmbed(`Sem resultados para \`${query}\`.`)],
    });

  try {
    const { queue, track, searchResult } = await player.play(channel, result, {
      nodeOptions: {
        metadata: interaction,
        ...playerOptions,
      },
      requestedBy: interaction.user,
      connectionOptions: { deaf: true },
    });

    const embed = BaseEmbed().setFooter({
      text: `Requisitado por: ${interaction.user.tag}`,
      iconURL: interaction.member.displayAvatarURL(),
    });

    if (searchResult.hasPlaylist()) {
      const playlist = searchResult.playlist;
      embed
        .setAuthor({
          name: `Playlist na fila - ${playlist.tracks.length} músicas.`,
        })
        .setTitle(playlist.title)
        .setURL(playlist.url)
        .setThumbnail(playlist.thumbnail);
    } else {
      embed
        .setAuthor({
          name: `Música na fila - Posição ${queue.node.getTrackPosition(track) + 1}`,
        })
        .setTitle(track.title)
        .setURL(track.url)
        .setThumbnail(track.thumbnail);
    }

    return interaction.editReply({ embeds: [embed] }).catch(console.error);
  } catch (e) {
    console.error(e);
    return interaction.editReply({
      embeds: [ErrorEmbed(`Algo deu errado ao tocar \`${query}\``)],
    });
  }
}
