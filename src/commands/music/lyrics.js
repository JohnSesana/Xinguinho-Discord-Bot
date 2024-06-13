import { ApplicationCommandOptionType } from "discord.js";
import { lyricsExtractor } from "@discord-player/extractor";
import { ErrorEmbed, BaseEmbed } from "../../modules/Embeds.js";

const lyricsFinder = lyricsExtractor();

export const data = {
  name: "lyrics",
  description: "Mostra a letra de uma música.",
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: "query",
      description: "Nome da música para pegar a letra.",
      required: false,
    },
  ],
  category: "music",
};

export async function execute(interaction, queue) {
  await interaction.deferReply({ ephemeral: true });

  const query =
    interaction.options.getString("query", false) ??
    `${queue?.currentTrack?.author} - ${queue?.currentTrack?.title}`;

  if (!query) {
    return interaction.editReply({
      embeds: [ErrorEmbed("Você esqueceu de por uma música.")],
    });
  }

  const result = await lyricsFinder.search(query).catch(() => null);

  if (!result || !result.lyrics) {
    return interaction.editReply({
      embeds: [ErrorEmbed("Nenhuma letra encontrada para essa música")],
    });
  }

  const lyrics =
    result.lyrics.length > 4096
      ? `${result.lyrics.slice(0, 4093)}...`
      : result.lyrics;

  const embed = BaseEmbed()
    .setTitle(result.title)
    .setURL(result.url)
    .setThumbnail(result.thumbnail)
    .setAuthor({
      name: result.artist.name,
      iconURL: result.artist.image,
      url: result.artist.url,
    })
    .setDescription(lyrics);

  return interaction.editReply({ embeds: [embed] });
}
