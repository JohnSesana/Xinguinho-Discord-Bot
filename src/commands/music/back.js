import { useHistory } from "discord-player";
import { ErrorEmbed, SuccessEmbed } from "../../modules/Embeds.js";

export const data = {
  name: "back",
  description: "Retorna para a música anterior",
  category: "music",
  queueOnly: true,
  validateVC: true,
};

export async function execute(interaction) {
  const history = useHistory(interaction.guildId);

  if (history.isEmpty())
    return interaction.reply({
      ephemeral: true,
      embeds: [ErrorEmbed("Nenhuma música anterior")],
    });

  await interaction.deferReply();

  await history.previous();

  return interaction.editReply({
    embeds: [SuccessEmbed("Retornou para a música anterior")],
  });
}
