import { useMainPlayer } from "discord-player";
import {
  ErrorEmbed,
  SuccessEmbed,
  WarningEmbed,
} from "../../modules/Embeds.js";
import playerOptions from "../../config/playerOptions.js";

export const data = {
  name: "join",
  description: "Faz o bot dar join no seu canal de voz.",
  category: "music",
};

export async function execute(interaction) {
  const { guild, member, reply } = interaction;
  const selfChannel = guild.members.me?.voice?.channel;
  const memberChannel = member.voice?.channel;

  if (selfChannel) {
    return reply({
      ephemeral: true,
      embeds: [ErrorEmbed("Já estou em um canal de voz.")],
    });
  }

  if (!memberChannel) {
    return reply({
      ephemeral: true,
      embeds: [ErrorEmbed("Você precisa entrar em um canal de voz primeiro!")],
    });
  }

  if (selfChannel?.id === memberChannel.id) {
    return reply({
      ephemeral: true,
      embeds: [WarningEmbed(`Já estou no canal: ${selfChannel.toString()}`)],
    });
  }

  try {
    const player = useMainPlayer();
    const queue = player.queues.create(guild.id, {
      ...playerOptions,
      metadata: interaction,
      selfDeaf: true,
    });

    await queue.connect(memberChannel);

    return reply({
      embeds: [SuccessEmbed(`Deu join no canal: ${memberChannel.toString()}`)],
    });
  } catch (error) {
    console.error(error);

    return reply({
      ephemeral: true,
      embeds: [
        ErrorEmbed("Houve um erro ao entrar no canal. Tente novamente."),
      ],
    });
  }
}
