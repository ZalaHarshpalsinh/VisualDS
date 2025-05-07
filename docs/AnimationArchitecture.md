# Animation Architecture

For implementing animations in entities, we had two choices.

## Choice 1: Synchronization

In the first one, we add the animations in a synchronized manner. For eg: from 0 to 2 seconds, array index variable moves, and from 2 to 3 seconds, the element gets highlighted. In this way, as soon as the user's code has executed, every entity knows when it has to do what. Now the problem with this architecture is, well, synchronization. How to synchronize the animations so well? Across different entities? With the user just calling increment() on pointer, highlight() on array element? We decided this would not be scalable in the long run.

## Choice 2: Queuing

The second choice is queuing. We queue the animations in a centralized queue, managed by our framework (specifically Animation class' object). This way, no entity needs to synchronize with other. The animator takes one animation from the queue at a time, and till that animation is not completed, it does not take another. Now, here, no entity knows from the start when it has to do what. Based on the animation taken out from the queue, it is decided which entity will do what. But it must be known to the entities what they are supposed to do, right? And since they don't know this from the start as in choice 1, we have to make them stateful. Every entity has to know in what state it is. Hence, we need states in entities.

# How are we using these states?

As soon as the animator takes one animation out from the animation queue, it itself transits to the 'animating' state so that it does not take out any other animation, also it informs/notifies the respective entity about the animation. It is up to the entity what to do with that information. It is *advised* that the entity transits to a state related to that animation, so that in subsequent update and draw calls to that entity, it knows that needs to do the animation. After the entity is done with the animation, it needs to make itself and the animator 'idle', so that the animator knows that it can now take up another animation from the queue.

# How are we managing the states?

To manage different states of the same entity, we are using the concept of StateMachine, and it is advised that anyone who implements an Entity of their own does the same, although any other state management pattern would work fine too. Now, what is a state machine? Really, it is an object that encapsulates the current state of an entity. Whenever draw() is called on the entity, it delegates the call to draw() of the state machine, same for update(). Whenever the entity is informed/notified about an animation, it just passes on that information to the statemachine, which creates a new object based on that information.