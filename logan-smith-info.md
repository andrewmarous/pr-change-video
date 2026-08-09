## The Dark Side of reserve()
### Transcript
hey YouTube if you've used Dynamic
arrays AKA vectors or other data
structures in your code as I'm sure you
have you might have run into this method
Reserve this is a powerful tool for
pre-allocating memory right before
adding a bunch of elements to your data
structure which can be a great low
hanging performance optimization for
your code but just like all powerful
tools if used incorrectly it can be
dangerous in this one we'll talk about
what Reserve is good for and when and
where you should definitely use it but
also if you're using it incorrectly how
it might be destroying your performance
so this destroying your performance
issue is very personal to me because I
initially ran into it when I wrote some
code that was supposed to be fast but
was very not fast and I was very
confused until I learned why
this was in a rust code base but I've
also run into it in a c plus code base
that was using the standard library and
I most recently ran into it in the
Unreal Engine code base which is also a
c plus code base while I was working on
one of my other videos so this is a
cross-cutting concern and it doesn't
matter what language you're in it's
fundamental to the design of the dynamic
array data structure but as it so
happens these are my two favorite
programming languages so I'm going to
kind of be talking about both in this
video but in order to do that I'll need
to Define my terms so when I say reserve
I'll be referring to a method on a data
structure that changes the data
structure's capacity in other words
pre-allocates memory to hold n elements
or does nothing if n is less than the
current capacity in particular here this
method reserves memory for exactly n
elements regardless of the current size
of the data structure in C plus plus the
reserve method on stood Vector has this
Behavior now to be pedantic the C plus
standard doesn't actually guarantee this
Behavior it allows implementation to
reserve space for more than n elements
but I checked all three major standard
library implementations and they all
just reserve space for n elements also
as I hinted I'll be talking about Unreal
Engine very briefly and their Dynamic
array is called T array and its Reserve
method also has the same behavior by
default now in Rust the standard method
that has this behavior is reserve exact
on vac vek actually has a reserve method
too that does something similar but
doesn't have the issue that I'm going to
be talking about for reasons I'll
explain later so in this video when you
see reserve and yellow I'm talking about
this method that reserves the exact
amount of memory that you asked for and
just keep in mind that in Rust that
method is actually called Reserve exact
sorry if this is a little complicated in
this video I'm talking about a method
that's usually good but sometimes bad
across two languages where it's called
different things and in C plus its
behavior is not technically guaranteed
oh and one more thing in Rust it's not I
want capacity for n total elements it's
I want capacity for n additional
elements anyway I hope this all isn't
too confusing uh try to be as clear as
possible so let's set the stage by
looking at the code in Unreal Engine
That made me want to make this video
so I was poking around in unreal looking
at this class use blind component which
basically describes a curve in 3D space
that passes through some points that you
give in and you can use it for all sorts
of cool stuff for my use case I was
looking to build one of these up
programmatically by adding points
gradually as I computed them in a loop
so I gravitated toward this pair of apis
add point for adding one and add points
for adding multiple now at first glance
it might seem strange that there's both
I mean if we have ADD Point can't we
just call it in a loop why do we need to
add points well it's possible that add
points is just a convenience but when I
see this API especially in a game engine
that's highly focused on performance it
makes me think that the fact that they
decided it was worth implementing an
entire separate method for adding
multiple points must mean that they're
doing something better in the
implementation that we can't do
ourselves just by calling add point in a
loop side note it's a little unfortunate
that this points parameter is a t array
this means that to add multiple points
you first have to stick them all on the
Heap in a dynamically allocated array
that's because unreal doesn't have
anything like a lazy iterator
abstraction or generic views into
contiguous memory like C plus is stood
span or rust slices as part of its Core
Design so you have to put these points
on the Heap that makes this method and
others like it more expensive than they
need to be which is too bad especially
because my hunch is that this method is
here to improve performance for bulk
operations anyway what could ad points
be doing internally that's so
interesting well let's take a look
so here's the body of AD points it's
pretty simple there's this update spline
stuff which is a little optimization
that we could have also done ourselves
that does some expensive math just once
at the very end instead of for each and
every point but the bulk of this
function is just a loop that calls add
point with each of our points so why do
we need a special method for this why
couldn't we have just done this
ourselves well take a look just above
the loop before the loop this function
calls reserve on a private internal data
structure to warn it in advance about
the number of points we're about to add
and this seems really smart we have a
handful of points we're going to add
them all so we might as well
pre-allocate enough space for them all
up front but as good as this idea sounds
on paper it is actually fairly dangerous
to have this Reserve in here depending
on your usage pattern of your spline
this Reserve call might give your code
quadratic complexity and increase the
number of reallocations instead of
reducing them I'll explain how and why
and I'm also not necessarily saying that
Unreal Engine is doing anything wrong
here it's possible this Reserve is a
good fit for their use cases but when
you are designing your apis this is
something you should be aware of and
I'll explain it but first let's just
review what Reserve is supposed to do
what problems is supposed to solve and
what the intention is behind putting it
in a spot like this
so let's look at an example here's some
pseudocode that creates an empty vector
and then pushes the numbers one through
seven into it let's look at what this
code is going to do behind the scenes so
we start out with our Vector object on
the stack just empty and a vector is
made up of a pointer to its Heap data
its current length and its current
capacity an empty Vector isn't going to
allocate memory so it's going to have a
capacity of zero that means that the
pointer will be pointing at nothing in C
plus plus this fact will probably be
represented as a null pointer which is
great because it means that a default
constructed Vector will have a bit
representation of all zeros making it
very simple and cheap to construct in
rust on the other hand the pointer will
instead be a non-null dangling pointer
so that the compiler can use all zeros
as a niche for layout optimizations so
different decisions there with different
pros and cons
now let's push our elements when we go
to push 1 the vector needs to allocate
memory to hold it let's say that it
allocates memory for exactly one element
although in reality your vector
implementation and or your allocator
might give you more especially if your
elements are small we move our 1 into
the allocated buffer and update our
vector's length and capacity bookkeeping
data now when we go to push 2 we
immediately have to allocate memory
again we allocate a larger buffer move
the existing one from the old buffer to
the new point at the new buffer update
our capacity destroy the old buffer and
then finally move two into the new
buffer then we go to push 3 and
something interesting happens we
allocate more than enough space for our
three that's because Vector isn't just
allocating enough room for one new
element on each push it's actually
doubling its current capacity each time
we'll see why shortly for now notice
that when we push 4 we don't need to
reallocate
when we get to 5 we double the capacity
again for a total of eight
the next two elements sail straight to
the vector without a reallocation we end
up with a vector with all of our
elements and one spare slot at the end
for adding one more element without
reallocating if we want to so for a
quick digression we need to talk about
this doubling thing if the rest of the
video is going to make sense so this
doubling of the capacity every time is
known as exponential growth sometimes
called geometric growth which has
interesting consequences for algorithmic
complexity in particular it means that
push operations or pushback as it's
known in C plus have this complexity
which is pronounced amortized constant
complexity now when I first learned this
I was confused because it sure seemed
like some of our push operations just
now did some stuff that felt like linear
time complexity there are many ways to
show that this is true though including
mathematically proving it but here's a
quick informal illustration that helps
it click for me so think back to just
now when we were pushing five pushing
five caused a reallocation so the cost
of pushing 5 was the cost of moving five
into our new buffer and also moving the
numbers one through four from the old
buffer to the new buffer but once we
paid that big cost up front the next few
pushes did not have to pay it again they
only had to pay the constant cost of
moving their respective elements into
the buffer we didn't actually push 8 but
if we had that would have had a constant
cost too so when we pushed five we sort
of paid part of the cost of pushing six
seven and eight up front when we look at
this series of operations as a group we
can sort of divide the linear cost of
pushing five among all the times we
didn't have to do it afterward from this
angle each push pays off the cost of
moving one of the elements from the old
buffer to the new last time we
reallocated and this is what we mean by
amortized constant complexity any
individual push viewed in isolation
might have linear complexity but when
you view the pushes as a series of
operations it evens out and it's as if
each one had constant complexity note
finally that when we go to push 9 we
have to reallocate again but that's okay
the cost of our last reallocation is
fully paid off by the time we get to
nine and in fact because we're doubling
every time that will always be true each
time we need to reallocate the previous
reallocation will have been fully paid
off now specifically doubling isn't
essential though the growth just needs
to be a factor of the current size
choosing a good growth factor is an
important part of tuning your vector
implementation and in fact there's some
research to suggest that two is actually
a bad choice but that's beyond the scope
of this video I encourage you to look up
FB Vector in Facebook's Folly library
for more info Link in the description
alright digression over what can we do
better in that example we just saw well
two things first we know exactly how
many elements we're going to push into
the vector before we do so we should
just give the vector a heads up about
that before we start so it doesn't need
to keep reallocating memory as we're
pushing elements we also ended up with
some extra capacity at the end we might
not have a use for and that costs us
some memory overhead maybe we can just
feed two birds with one scone let's call
reserve the yellow one before our Loop
this looks a lot like what you would
write in C plus in rest you'd probably
just use the width capacity Constructor
on VEC to make this a one-liner so let's
see what this looks like now we start
out with our same empty vector and our
same elements we want to push but the
first thing we do is call Reserve to
allocate space for exactly Seven
Elements now we can just move all of our
elements directly into this buffer
without any intermediate reallocations
and at the end we're left with a buffer
that is perfectly sized with no extra
spare capacity at the end modulo any
subtleties of our memory allocator so
this is great and perfect and exactly
what Reserve is designed to do use it in
this situation more precisely use
Reserve or Reserve exact if you know how
many things are going to end up in your
data structure in my experience it's
most useful right after you create an
empty Vector right before you push a
bunch of things onto it in a loop as we
saw those early pushes can cause lots of
reallocations if you haven't called
Reserve so it can be a great tool for
getting rid of those
so if it's so great how can it go wrong
well to answer that let's look at some
pseudo code that mirrors the add points
function from unreal that we saw earlier
this function bulk append takes in some
elements and calls reserve on some
Vector it has called V before pushing
the elements onto that Vector in a loop
seems reasonable now let's imagine that
we're calling this function from our
code and let's imagine that our
algorithm and our business logic
produces values two at a time via this
get next to LMS function which let's
assume has constant complexity in the
unreal curve example imagine that this
function Returns the next point we want
to use along with also that same point
mirrored about some axis for some kind
of interesting effect after getting
those next two points we pass them into
bulk of pen to stick them in our data
structure let's look at what happens
behind the scenes when we execute this
code
so first off we don't necessarily know
the state of the vector inside bulka pen
before we enter our loop it's some
Vector that survives between calls to
bulk append so it could very well
already have some stuff in it from
before our Loop so let's assume that it
does
now we enter our Loop we produce two
elements and the first thing that bulka
pen does is call reserve on the vector
note that reserving is linear in the
current size of the vector so all the
existing elements have to be moved to
the new allocation then we move our
elements in now the next two elements
come in and we have to do the same thing
again in fact we're going to have to do
this for every single pair of elements
that comes in we're going to have to
reserve and reallocate every single time
causing a linear time operation for
every single pair
the Fatal flaw here boils down to the
fact that at our call site we are
calling bulk append in a linear time
Loop and the reserve inside of bulk
append is causing the vector's capacity
to grow linearly rather than
exponentially like we saw before which
effectively makes our pushes linear
instead of amortized constant these two
ingredients make it so that our Loop has
quadratic complexity in this Reserve
call That was supposed to reduce
unnecessary reallocations is actually
leading to way more frequent
reallocations
so the bottom line is this don't call
Reserve in a loop because if you do
you're thwarting your vector's efforts
to grow efficiently for you and this
gets to the heart of the issue but it
also isn't the most helpful piece of
advice I mean we didn't call Reserve in
a loop in our example we just wrote a
loop that ended up calling Reserve
through a layer of abstraction so it's
up to the person writing that layer of
abstraction to protect their users from
this how well my advice is if you're
writing a public API and you're
operating on a vector that you got by
reference whether that's literally
through a function parameter or through
a this pointer or a self-reference or
anywhere else don't use Reserve or
Reserve exact and rust because you don't
know what else your caller might be
planning to do with their vector and it
might include calling your function
again maybe even in a loop and if you've
used Reserve you'll be setting them up
for a bad time to put it another way
Reserve is best for vectors that are
local variables or that are part of
private apis where you have full
knowledge of the vector's usage
characteristics and can be sure that you
won't fall victim to this issue
but for your public apis what should you
do instead surely we need a way to
append multiple elements at a time
possibly pre-allocating if necessary
while preserving your vector's geometric
growth well in Rust it looks something
like this this is the behavior of the
regular Reserve method in Rust and it's
why I said that rust's Reserve doesn't
have this issue about quadratic
complexity it reserves while maintaining
exponential growth unlike Reserve exact
but if you didn't know about this
distinction between reserve and Reserve
exact that might be because it's more
idiomatic in Rust in cases like this to
just not use Reserve at all methods like
extend already have Library Machinery to
specialize on the iterator type they're
given and pre-allocate memory if
possible unlike with a series of pushes
there's no need to explain to the vect
that you're about to add multiple
elements before you call extend since
extend is just one function call it has
all the information it needs to
pre-allocate for you just as well as you
could manually now what about C plus
there are a couple ways to to do it one
of them starts like this you use the
resize method rather than the reserve
method this actually changes the length
of the vector not just its capacity and
it does that by default constructing
elements at the end we can then copy
over the new elements into those new
slots overwriting those default
constructed elements you can either use
a handwritten Loop or my personal
preference an STL algorithm here I'm
using stood copy along with some move
iterators to make sure the new elements
get move assigned into their new slots
you don't have to use move iterators if
your type is like trivially copy
assignable but I like using them to
document that I'm like draining a vector
into another Vector anyway this approach
works but it has some definite downsides
it's a little cumbersome and it requires
that your type be default constructable
but it does preserve your vector's
geometric growth because the resize
method uses the vector's regular growth
strategy whereas reserve circumvents the
growth strategy anyway if this were all
I was doing I would not write it this
way I'd write it another way I'll show
you in a sec but I'm showing this way to
highlight this the shape of it which can
be useful in particular because you can
replace stid copy with another algorithm
of your choice for example stood
transform which lets you run each
element through a function before it
lands in its final position in the
vector if you do just want to append the
elements verbatim though it's much
simpler just to insert your range of
elements at the end of the vector this
overload of insert takes a range of
elements and sticks them wherever you
tell it in this case the end while
preserving the vector's geometric growth
and just like rust's extend it will look
at the iterator types you give it and
try its best to determine how much space
to pre-allocate before it starts
inserting any elements this method is
generally the tool you want to reach for
for appending in bulk to vectors or
really any containers in C plus
so in summary if you want to append in
bulk use an API designed for appending
in bulk don't try to re-implement it
yourself using Reserve
so we started this discussion with
unreal let's finish with unreal 2. so
what tools does t array give us to
mitigate these issues there are a couple
of apis that mirror the apis we saw
instead vector and also many more some
of which are fairly Advanced and
potentially dangerous but really let you
unlock performance if you use them well
with these methods in mind it's possible
that you spline components add points
method could benefit from another look
to see if it's worth making a change
I've also glossed over some of the
details of the add Point method that
gets called in this Loop and I haven't
studied all the intricacies of what it's
doing what I do know is well the world
gets better when we all work together to
make it better and I know that Unreal
Engine accepts contributions maybe I'll
do some more research and then send them
a patch or if you're watching this maybe
you can
thanks for joining me today I hope you
learned some stuff about Reserve but
more broadly I hope you enjoyed diving
deep into this data structure that's so
fundamental to our craft and seeing how
two world-class programming languages
have designed their implementations of
it I hope you leave me a comment and
I'll see you next time

### [Youtube Link](https://www.youtube.com/watch?v=algDLvbl1YY&t=723s)
---

## Cursed C++ Casts
### Transcript
hey everyone in honor of October I'd
like to spend our time today reading a
scary story entitled The Curse of the
casts this is a classic who done it
story where we'll encounter frights
around every corner as we answer the
question what is the scariest cast in
all of C++ join me now as we embark on
our adventure this story is dedicated to
our friends const cast Dynamic cast and
boost lexical cast while they don't
appear in the story as main characters
they deserve our fear and respect here's
what our journey has in store in chapter
1 we'll set the tone and establish some
themes that will recur throughout our
tale by discussing a cast that's not
that scary in Chapter 2 we'll discuss a
cast that feels scary on its surface But
ultimately can be done easily and
without undefined behavior in chapter 3
we'll discuss a cast that feels like the
scariest cast you can imagine and we'll
see the terrifying way it can be
implemented legally in C++ but finally
in chapter 4 we'll learn that the
scariest cast of all was the one we knew
all along without further Ado chapter
one let's say I have a function that
looks like this it's a function template
that takes two parameters of the same
type now I want to call this function
with two objects base and derived and as
the name suggest let's assume the type
of derived inherits publicly from the
type of base now when I call this
function template without providing any
explicit template arguments the compiler
has the task of figuring out what T is
it looks at the first parameter and sees
that t must be base then it looks at the
second parameter and sees that t must be
direct arrived those two types are not
the same so type deduction fails this
code doesn't compile you've probably run
into this before when using St Max for
example it doesn't matter if the
arguments can implicitly convert to each
other for the purposes of type deduction
they have to match exactly so this is
easy to fix right we can just static
cast our derive to base and force the
conversion to happen and now everything
works but I have a bone to pick with
this code derive to base is an implicit
conversion that can happen without a
cast but we just wrapped it in a static
cast stac cast can do this conversion
for us but it can also do more it can
call explicit Constructors and explicit
conversion operators I don't want that
to happen here I just want to give
derived A little nudge to get it to
perform its implicit conversion without
running the risk of accidentally
performing a conversion that's supposed
to be explicit this comes down to an
important engineering tenant called the
principle of least power you should
always choose the least powerful tool
available that can get the job done it's
the reason I wouldn't cut a sandwich in
half with a chainsaw it's the reason I
don't hang out on my computer logged in
as root and it applies here too
static cast is slightly too powerful for
this conversion how about if we write
another cast and call it implicit cast
that will only perform conversions that
can be done implicitly I know this name
is an oxymoron because by writing this
it's no longer implicit but I think this
is still a compelling use case for a
tool like this so how would we implement
this well it's beautifully simple we
don't actually have to do any converting
we just have our parameter be the
Destination type and so the conversion
happens as the user is calling the
function they get a nice error message
message at the call site if it doesn't
work then we just return the converted
value and we get a nice implicit move
here by the way I'm emitting some
details that would clutter up the screen
in real code this function should be
Conex per no except If U is no throw
move constructible and no discard so
that's great but what's up with this
type identity thing well this is a
little trick that turns off type
deduction for this function parameter
the reason is that I don't want you to
be able to call this function without
specifying a Destination type I mean
that wouldn't do anything useful it
would just return the value you pass in
without converting it so I want to
prevent you from making that mistake
this type identity thing does that but
why well type identity is what you might
call a meta function which is a function
that instead of operating on values
takes one or more types and returns one
or more types type identity happens to
return the same type you pass in but
what the compiler sees is that we have a
meta function result as our parameter
type and that that result must be bass
because we're passing in bass but in
general that tells the compiler nothing
about you saying hey I have this meta
function figure out what to pass in to
get a base out would require the
compiler to be able to figure out the
inverse of your meta function while that
happens to be trivial here in general
it's not possible and the compiler just
won't do it it just says well I'll have
to figure out you some other way in this
case there is no other way so it falls
on the user to explicitly pass it in
note that type identity T is an alias
for this longer syntax and the rule of
thumb is that if you have a double colon
after a type in your parameter type that
parameter won't be able to attribute to
type deduction so here's our implicit
cast it's the least Powerful cast that
actually does anything and as such it's
one of my
favorites chapter 2 here's a famous
piece of code from Quake 3 Arena I've
tweaked it very slightly but kept the
spirit including the comments in the
real code this function uses some dark
magic to approximate 1 over square root
of x which is useful for normalizing
vectors and stuff like that it has this
strange implementation that was faster
on the hardware of the time than doing
it the more obvious way that's no longer
super true especially as some isas have
dedicated instructions to do exactly
this but this is still a fascinating
artifact from the history of our field
the Special Sauce is here notice that
the author is warning us of the evils
ahead another nice literary Trope for
our story by the way this was C code
originally but these are essentially C++
reinterpret cast so let's rewrite them
that way basically what we're doing here
is exploiting some details of how i e
floats are represented in memory we want
to do some bit twiddling operations but
you can't do those on floats so first we
reinterpret the bits in our float as
though it were an integer then we shift
our integer and subtract it from a magic
number I agree with the comment on this
I've never actually studied what this is
doing or why this works but it's
something cool and then we convert our
integer back into a float so this is
pretty bizarre and amazing and I
encourage you to go learn more about
this code but unfortunately I have to be
that guy and point out that it has
undefined behavior in both C and C++
actually the reason is a little outside
of our scope today but here are some
terms to Google essentially with a
couple of special exceptions you're just
not allowed to refer to the same memory
through pointers of different types at
the same time so how do we do this I
mean the whole point of a systems
language is to have low-level control
like this and it's clearly useful to be
able to do I mean here's a use case so
let's write a cast that I'll call pun
cast because what we're doing here is
called type punning and we'll implement
it in a way that doesn't suffer from UB
so how can we do that well one way you
might think of is using a union if we
create a union that stores T and U in
the same memory and then write our T in
and read it back out as a u that seems
like it should work but it actually
doesn't it works in C but in C++ you are
not allowed to do this in C++ the only
Union member you're allowed to read from
is the last one you wrote to so this
implementation has undefined Behavior
the reason again is strict aliasing
where we're not allowed to have two
views of different types into the same
memory at the same time so we need to
somehow do this cast in a way where we
never treat the same memory location as
two different types one way to do that
is with mem copy this function literally
copies the bytes from one place to
another but we never have two pointers
with different types pointing at the
same memory location now this is
somewhat dangerous to do we need to be
sure the types are the same size and
there aren't any copy Constructors we're
bypassing by doing this you could also
use SP or concepts to constrain this
template instead of static asserting but
this code has one more problem it can't
be coner the reason is that mem copy is
not a Conex function so our pun cast
will never be able to execute at compile
time before C++ 20 we would have been
stuck here there was no way to type pun
at compile time but C++ 20 introduced a
tool called bit cast in The Standard
library that is Magic it is defined as
behaving like our mem copy code except
it magically works at compile time too
it requires special compiler support to
implement it but luckily it makes our
pcast a oneliner also just kind of
redundant we could have just used bit
cast at our call site back in our
inverse square root function so bit cast
fast while being powerful and low level
is not scary it's explicitly blessed by
the C++ standard and is an Irreplaceable
tool in our
toolbox now it's time to meet a
contender for the most evil cast of all
I certainly can't imagine a cast more
evil than one that takes your class's
private data members or member functions
unless you treat them as public this
would utterly destroy your ability to
reason about your code since you would
have no way to trust that any object in
your program hadn't had its internal
invariance to tempered with but would
you believe me if I said that we can
write public cast legally in C++ without
undefined Behavior watch and be
terrified to motivate this let's say
that we have a class C with a member X
that we'd like to access from the
outside note that X is private because
the default visibility of members in
classes is private so this whole trick
is going to hinge on this interesting
quote from the C++ standard that says
that when you're declaring an explicit
template instantiation the normal checks
that prevent you from accessing private
stuff outside of a class are turned
turned off so you can refer to for
example names that are normally private
as long as you're doing it while
declaring an explicit instantiation so
to see what this means let's try to
create a pointer to member variable that
points at C's X member doing this
outside the class leads to an error
because X is private and its name is
inaccessible so that's what we'd expect
now instead let's create a class
template that just takes in a value as a
non-type template parameter and stores
it in a static member now according to
that quote from the standard if we
explicitly instantiate this class
template we are allowed to name C's
xmember while doing so access checks are
turned off in this moment and we can
just get a pointer to this private
member no problem so are we done well
not quite we can't actually use this
explicit instantiation very easily if we
want to use it we have to spell out its
name and that's going to involve
mentioning C colon X but when we do on
this line we're no longer inside the
explicit instantiation declaration so
this mention of X gives us an error so
we're not quite Home Free yet what do we
do well the evil trick we're going to
use is that right here when we're
writing down this pointer inside of our
vow class we are also going to write it
down somewhere else that we can retrieve
later without needing to mention the
actual member I'm going to call that
place public cast there's going to be
another class template that has a static
member inside but notice that this
static member is not const you'll see
why the class template is also going to
have a special key as a template
parameter that I'm calling secret that
we use while instantiating vow to
smuggle the pointer out and we use the
same key later on to look the pointer up
now let's extend Val to take in a secret
from the outside and in the
instantiation I'll pass in a secret
called CX secret and now here's the big
reveal while we're initializing V's M
member oops we're also going to assign m
to the static member of public cast this
might look kind of trippy but it's just
a chained assignment remember that in
C++ assignments usually return a
reference to the thing you just assigned
to so we are assigning capital M to
public cast static M and then
constructing vs static M from that this
is why public cast m is not con so we
can assign to it in the middle of this
expression so we now have a pointer to a
private data member inside an
instantiation of public cast and all we
need to do to get it is use the secret
to look up the right instantiation
here's how it looks I'm not saying it's
pretty but we use our public cast
template using our key to grab the
instantiation we want and then we use
thear operator on an instance of C to
actually get a reference to its X member
we also have to pass in the type of the
pointer to X I couldn't think of to
avoid this but let me know if you can
but otherwise here's our public cast our
vow class might be better named
something like access since it's
required for getting access to the
private member in the first place and
here's the complete usage this technique
is fully legal and it works for both
private member data and private member
functions now should you do this in your
code obviously not as I already
mentioned doing this makes your code
impossible to reason about because it
means you can no longer trust that any
of your objects that we're trying to
maintain in Vari
still have those invariants intact this
cast is deeply evil but by the same
token I would argue it's not actually
that scary first of all no one's doing
this I've never actually seen this in
real code and even if you decided you
needed it look at the syntax it'll take
so long to type that you'll have plenty
of time to rethink your life in the
meantime no it may be the most evil but
it's not the scariest the scarious cast
is not the ugly one that goes out of its
way to explicitly break your code
instead it's the simple unassuming one
we've known all
along the scariest cast in C++ is the C
style cast who would have thought I mean
look at that nice syntax it also applies
to this syntax which is exactly
equivalent when it's used with one
argument now when I was first learning
C++ and I was wondering whether to use C
style cast or the more of verbose C++
style cast I heard a lot of advice like
this oh we should use the C++ cast
they're more explicit they're easier to
grip that's all true but it understates
things I don't I don't remember anyone
ever telling me this that sea style
casts will break your code but it's true
and i' like to talk about this as we
bring our scary story to its heart
pounding conclusion so remember from
chapter 1 when we talked about the
principle of least power the problem
with sea style cast is that they are
incredibly powerful dangerously so first
of all let's just walk through what they
do the way sea style casts are specified
is that the compiler will try a bunch of
different kinds of casts until one of
them makes sense for the Opera and on
the type between the parentheses
here's what they try in order the first
thing they try is const cast this should
already scare you if you accidentally
forget a const in the type between the
parentheses sea style cast will not
complain they will just Cast Away Your
const if a plain const cast doesn't work
sea style cast will try to act like an
extra powerful static cast the extra
powers are that you can cast an object
to a private Base Class that's bunkers
if you ask me it means that trying to do
encapsulation using private inheritance
is just useless because users can just
sidestep it using the easiest cast to
spell in the whole language next if that
doesn't work it tries Uber static cast
followed by const cast so you can cast
to a private base and Cast Away const in
the same expression lastly if none of
that worked C style cast is like well I
guess you meant reinterpret cast or
actually maybe you want to reinterpret
cast and then also Cast Away const so
that's really powerful but is your code
really going to break yes watch I have a
struct s and it's inheriting publicly
from bass and also some interface IU and
let's assume that Bas is 4 bytes let's
also assume I have a function called P
that just prints the address that's in
the pointer you give it so let me create
an S and just print its address there it
is now I'd like to print s but converted
to its public Base Class iue this is
actually a perfect spot for implicit
cast from chapter 1 since this
conversion just needs a little nudge it
doesn't need the full power of an
explicit conversion and note the address
when I do this since bass is 4 bytes and
iue is second in the inheritance list
the address of the iue subobject of s is
actually Four bytes after the start of
the S object itself the compiler
understands this and performs this
little offset for us when we convert an
S star to an iue star the same thing
happens with static cast static cast
understands The Inheritance relationship
between s and IU and knows that to
properly convert we need to do a little
pointer
offset now look what happens when we
reinterpret cast it does not do this
offset for us this is a good example of
the difference between static cast in
reinterpret cast static cast says do
this pointer conversion within the
semantics of the language whereas
reinterpret cast just says Pretend This
pointer has this other type and that's
the wrong thing here and it's not safe
to use the pointer you get out now let's
try C stycast C stycast actually gets
the right answer here it behaves like
static cast in this case because it can
but now let's look at what happens if we
refactor our code so that S no longer
inherits from IU I still have the same s
object same address now our implicit
cast and stattic cast both stop
compiling as they should it no longer
makes sense to convert an SAR to an ifue
star those two types are now unrelated
if we remove IU as a base class of s
anywhere we've relied on them being
related we need to fix our code and by
using less powerful cast like implicit
cast and static cast we now get a to-do
list from the compiler of all the spots
we need to fix reinterpret cast is still
broken just like before nothing has
changed look what happens with our C
style cast though stattic cast no longer
makes sense here so C style cast Now
searches further down its list and it
falls back to being a reinterpret cast
note that the address is wrong just like
the line above when we broke the
inheritance relationship our sea style
cast silently changed meaning and didn't
tell us about it if we're refactoring a
large codebase how are we even going to
find this I think this one example
should be enough to convince anyone on
Earth to never use Sea style cast ever
again and yet even I still find myself
tempted to use them and it's because the
syntax is so convenient the other casts
are so verbose and explicit which I
think would be great design for calling
out ugly operations in your code with
ugly names except that we have this
other tool that's cleaner easier to use
and far more dangerous right at our
fingertips and so it was that the sea
style cast the most powerful of all the
casts with the easiest and most tempting
syntax who gleefully casts away your
const who insidiously breaks your
pointer cast and who laughs at the light
of private inheritance was therefore the
scariest cast of
all the
end
### [Youtube Link](https://www.youtube.com/watch?v=SmlLdd1Q2V8)
---

## Moves are Broken
### Transcript
The invariant of this data is that the address stored here actually points to some memory we've allocated and that we
are responsible for freeing when we're done. If we try to take this and put it somewhere else, we need to establish
that exact same invariant in the new location. One way is to create a new allocation and point at that from the
new location. This is actually what C++ tends to do by default. If you write the
simplest C++ syntax, you are probably doing deep copies like this when you pass around values that own allocations.
I hope you can see why this is undesirable. It's exorbitant to allocate memory just to shift a value around. The
smarter thing to do is to use the existing memory we already have allocated and just copy the pointer to
it. That's a million times faster. But there's a problem here. Now we have two
pointers pointing at the same memory and both of them think it's their job to deallocate it when they're done with it.
But a lot of times you are transferring the value to a new location and after
that you don't need the old value anymore. You only need it in the new location. So if that's the case, what
can we do with that old value to prevent this double free problem? Well, Rust and
C++ have different answers to this question. Rust forgets that the old value ever existed. It doesn't run a
destructor and it doesn't let you talk about the old value anymore. It is gone. This is how Rust implements move
semantics. It memcopies the shallow bit representation of the value to the new location and then just never thinks
about the old location ever again. You'll hear this called a destructive move. By moving out of the old value, we
implicitly destroyed it. So we don't need to explicitly call its destructor, let alone allow you to refer to it after
it's been destroyed. C++ has a different story. C++ the language actually doesn't
do much here. It keeps the old object alive after it's moved from and it leaves it up to the author of the type
as to what exactly to do. For an owning pointer like this, what would probably happen is the implementation would break
the link between the pointer and the allocation by setting the pointer to null. Now when the object is destroyed
and its destructor runs, there's no allocation for it to free. So its destructor doesn't do anything. But
notice that we just weakened our invariant. I didn't say anything about null before. I said this pointer owns an
allocation. But in order to move from it in C++, we have to say, well, it can
also be null. And so we've lost some of the simplicity and strength of this type. And remember, I also mentioned
that when we destroy this empty value, a destructor is going to end up running that does nothing. The compiler might be
able to see that and optimize it away, but there are plenty of cases where the compiler can't. So, it still has to call
destructors for moved from objects that end up just being a waste of time. Now, it's important to note that C++ didn't
have move semantics at first, and so when it was introduced, it had to be introduced in a way that didn't break anything. That's a big part of why it
looks the kind of strange way it does today. In fact, I think you could make a strong argument that C++ the language
doesn't have move semantics at all. It has two separate language features that conspire together to let library authors
implement move semantics. There's function overloading and then the real special sauce, there's a new type of
reference introduced in C++ 11 that is used for objects that are probably fine
to move from. Let's look at how those references work. So the thing that sets
the different kinds of references apart in C++ is what sorts of objects each one is allowed to refer to. We say a
reference binds to a given object and then it refers to that object forever. This kind of reference, for example,
this non-const reference with only one amperand can only bind to values like this. It can bind to variable names
directly or to subobjects that are reachable through variable names. These are called L values and they pretty much
correspond to any expression that you're allowed to take the address of. Another way to think of it is any single object
that you could refer to multiple times in your code by copy pasting the expression that refers to it. So these
are L values and this type of reference with one amperand is called an LV value reference. Notice again there's no
const. So there's the added constraint that this reference can only bind to these expressions if they evaluate to an
object that's not const. Now in C++ 11 in order to power move semantics they
introduced a brand new type of reference. This reference cannot refer to L values. It won't compile. But it
can refer to expressions like this. It can refer to expressions that evaluate to a brand new object or the address
returned by the address of expression or a function call expression if that function returns by value. Notice that
you are not allowed to take the address of any of these. And copy pasting these expressions would actually evaluate to
brand new values a second time, not the same values as the first time you type them. So these are called PR values,
which is supposed to sort of be short for pure values in some platonic sense. They don't have an address yet. They're
just kind of these idealized values floating in the ether in your code. A double amperand reference is one way to
grab hold of one so you can use it. So that's PR values. Now I already mentioned that these references cannot
be used with L values and that's true at least implicitly. But you can actually
explicitly cast an L-value expression to a double amperand reference. When you do this, you create what's called an X
value, which is short for an expiring LV value because it's like we're taking what was once an LV value and casting it
into the ether. Now, if you've studied move semantics before, you know that the standard library provides a special
function for doing this cast, and it's called move. [clears throat] But when you call move, all you're doing
is nudging an L value to become an X value. C++ refers to these collectively
as R values. So an RV value is either a PR value or an Xvalue. And this double
amperand reference is called an RV reference. By the way, to finish the story, you might also hear the term GL
value, and that just refers to an L value or an X value. So these are all the value categories in C++. There are a
couple more types of references, though. By the way, I'll tell you right now, we're skipping forwarding references, so don't come at me. We'll talk about those
some other time. The next kind of reference I do want to talk about is the const LV value reference. If you have a
const LV value reference, the rules are slightly different from a non-const LV value reference. Const LV value
references can refer to anything at all, both L values and R values, const and non-const. The const means it can bind
to any L value, whether const or not, since it's always safe to add const. And
the const also makes it safe to bind to R values, whereas binding a temporary to a non-const LV value reference would be
a major source of bugs. So it's prohibited. So const lv value references
are very useful especially for function parameters that you just need to look at. Lastly, there are const ral
references. These can only refer to R values. You need to be aware of these if you're writing super generic library
code, but const RV value references aren't useful for anything because, as we're about to see, to get the most out
of RV value references, you need them to be non-const. And if they are const, you should just use const LV value
references since they already work for everything. So we're just going to ignore constar value references.
Actually, we're just going to focus on these two. The trick here that gives us move semantics is that you can overload
functions based on these reference types. Here I have two overloads of the function f. If I declare an s and then
call f with an l value, just s's name, it will call the overload that takes a const lvalue reference. Remember, it
can't call the rval reference one because rval references can't bind to L values. So overload resolution picks the
const ref over overload. But if I call f with a PR value or an x value, it will
call the rval reference overload. It could call the lval reference overload since const l value references can bind
to r values, but the rval reference overload is a better match according to the overload resolution rules. So that
one wins. So having these two ways of passing parameters actually ends up calling two different functions. and
move semantics is when I do different things in those two functions. More on
that in a second. I want to point out real quick that if I remove this rval reference overload, the code still
compiles. It's just that the RV value cases fall back to the constre overload. This is kind of cool. If you have a
constref overload of your function, you can always add or remove an RV value reference overload without breaking your
code. This is how move semantics got into C++ at all in a backwards compatible way. You can start adopting
move semantics by starting to sprinkle around our value reference overloads, but your code still works whether you do
or not. So what does this have to do with moving though? Well, we can overload functions based on reference
types. And one of the kinds of functions we can overload is constructors. So let's say we have a class with an
expensive resource in it. If we want to be able to copy this class, we need to have a constructor that takes in an
existing instance of our class and creates a new one from that. This is called a copy constructor. And we take
the existing instance by const lv value reference. So right now this works for any possible source object. We'll make a
copy of the expensive resource and use that for our instance. But this is an expensive resource. What if we added an
overload to this constructor that took an RV value reference? What we know about R values is that they're either
temporary expressions or L values that have been explicitly cast to look like
temporary expressions. In other words, we have a strong reason to believe that they are going to be destroyed very
soon. So, we can use this clue to write a different implementation of our constructor that does a move that sort
of steals the guts of the source object because it's not likely to miss them for very long. We are going to do a shallow
copy of the resource from the source object. And then just like we saw earlier, we are going to set the source
object's resource to some empty state so that when the source object is destroyed, it doesn't do anything. And
by the way, this is why you want RV value references to be non-const. You need to be able to write some empty
state into the source. So we have basically stolen the resource out of this object, but it's okay because if
we're in this constructor, it means the object we recalled with is probably about to go away anyway. So this is what
I was saying earlier. C++ gives us our value references and overload resolution
and we use those two tools to implement move semantics ourselves in our function
overloads. Now there's this conspicuous no except here. In my opinion, your move constructor and move assignment operator
are the only time when no except is really worth worrying about, but you should definitely try to make your move operations no accept if at all possible.
Here's something to Google for more on that. I won't dwell much more on it here. So now we've seen how these constructors are implemented. Let's take
a look at a usage site to get a feel for it. So here we initialize some S with
the result of a function and then we construct a new S from that. This is going to call the copy constructor of S
because we're passing in an LV value reference. But if we cast it to an RV value reference, now we call the RV
value reference overload. Of course, we could also spell that instead move. So what is the state of S after we
construct S2 with an RV value reference? Well, we know we wrote some empty state
into S, but S is going to be alive until the end of the scope it was declared in.
It's still there. It just had its resource stolen. So, can we reason about it in any robust way? Well, for an
arbitrary type, no. You could of course write arbitrary code in the move constructor that does whatever, and
there's no controlling against that. But well- behaved types, including types from the standard library, follow this
rule. A moved from object is in a valid state. In other words, all of its
invariants still hold. It's not using one of those illegal bit patterns. But what state it's in is unknown. Now, this
valid but unspecified state is notorious when you're talking about move semantics, but we actually deal with
values in this state all the time. For example, at the top of this block, s is
in a valid but unspecified state. We don't know what kind of s this function returned to us, but we can reasonably
assume it's a valid string. We can use it, however, we can use any old string. The same is true for standard library
types after you move from them. You can use them in any way that doesn't have any extra preconditions. We can ask for
this string size. We can call seir that doesn't have any preconditions. If we want to do something that does have
preconditions, we can check them first. So a move from stood string is still a fully baked string. But by moving it, we
lose all knowledge about what state it's in. And if we want to use it further, we need to reestablish that knowledge. Now,
I really like this idea because I like the idea that all of my values in my program are valid. But it means that if
I want move to be efficient, probably implemented as stealing the meaningful guts of my type, I probably have to
weaken my invariance of my type to include a state that is empty, just like we saw with the owning pointer earlier.
For string, it makes sense because the empty string is a bonafide value of type string. But for many types like my S,
what does it mean to not have my expensive resource? So wanting our types to be in valid states after move weakens
our invariance. But also valid but unspecified states don't necessarily compose. And that becomes clear if we
take a look at a commonly touted C++ best practice, the rule of zero. The idea behind the rule of zero is that
there are certain lower level types like vectors and strings and file handles and smart pointers that manage a resource.
Those types should be RAI types. In other words, they should release the resource in their destructor. And once
you implement a destructor, you probably also need to implement all the other special member functions for correctness. This is called the rule of
five. And your resource management classes should follow it. All your other classes like your actual business logic
classes should be composed out of rule of five types and they themselves should follow the rule of zero. In other words,
they should let the compiler automatically generate the special member functions. See, this important
business class has members that are rule of five types, but it itself doesn't declare any special member functions.
Because it doesn't declare them itself, the compiler steps in and writes them for you. A compiler generated move
constructor looks like this. For example, it move constructs each member with the corresponding member from the
source object. Each of those constructors leaves the member from the source object in a valid but unspecified
state. But just because all of our members are themselves in a valid state according to what type they are, that
does not mean that our class is in a valid state. Let's look at a concrete example of that. Here's Cring, which is
an example I've also used in previous videos. It owns a null terminated character buffer and keeps track of the
length and whether the buffer is all ASI. Notice the invariance here. Len and is ASI both need to actually tell the
truth about the contents of the buffer. To make things interesting, let's add a conversion to string view where we
initialize it with our pointer to our buffer and our length. Now, we haven't defined any move operations. So, the
compiler is going to generate ours. What it's going to do is move from each member of the source. It's going to move
the unique pointer into ours. It's going to move the int and the bool which don't do anything special when you initialize
them with r values. So those are just copies. But the unique pointer is special. In fact, the standard library
strengthens the policy for unique pointer. A move from unique pointer is guaranteed to be null. So after these
two moves, the source object is in a completely broken state. It has a null
pointer to its buffer, but its len member is still the old value. So if we
tried to convert the source C string into a string view, it would completely explode. So it's not enough that each
individual member we have is in a valid state because our type has invariance about the relationship between members
and those relationships are destroyed by this compiler generated move constructor. And so I strengthen this
statement at the bottom. If you have non-trivial invariance, especially relationships between your members and
you follow the rule of zero, your type will probably be in an invalid state after you move. Now, I've never tried
this at scale, but I've had the idea of writing a helper template that's a rule of five type that holds a value and then
uses the second template parameter as the moved from state. So that would mean our len would correctly become zero when
moving from it, which helps, but our pointer is still null. And you're actually not allowed to construct a
string view from null, even if you pass a length of zero. So after move, we're still in an invalid state here where our
public API can't be used safely. And aside from that technicality, it just breaks our invariant that our unique
pointer is supposed to be pointing to a non-terminated buffer. So this compiler generated move constructor just isn't
going to work because it leaves the move from Cring in an invalid state. So we have to write one by hand. Let's try
that out. So we'll start the same way as the compiler generated one. We'll move each member off the source value. Now
the new C string that we're constructing is in the correct state. But now in these curly braces, we need to
reestablish the invariance of the C string we just moved out of so that it's in a valid state after move. So, we need
to be pointing to a null terminated buffer. I guess we allocate one here and then we update our other members to
correctly describe the empty string we just allocated. By the way, I can't decide if the empty string is asky or
not. Let me know what you think. And so, this is simple and it sort of works, but this memory allocation means our move
constructor can't be no except because allocating memory can throw an exception. Like I said earlier, we
really, really want our move constructor to be no except. I also just don't want to allocate memory in here at all because that's expensive and our move
constructor is supposed to be fast. Like that's the whole point. So, what else can we do? Well, what if we just set
aside a global buffer that we can use for the empty string? That sort of works, but then we're going to run into
trouble with our unique pointer, which thinks it's supposed to delete the buffer it's pointing to. So, maybe we
have to not use unique pointer and or add some conditional logic to our destructor to check for this case and
not actually delete what we're pointing at. So that adds implementation complexity and means we can't use unique
pointer even though this is like what unique pointer is for managing an allocation you own. We could also way
increase our implementation complexity by doing something like the short string optimization where we use some of our
stack footprint to store characters in line when we're under a certain size. That's doable, maybe even desirable, but
it takes this simple class and turns it into a full-on engineering project. I didn't even know this before I started
working on this video, but this exact example of a simple cring class appears in the original paper for move
semantics. The authors there come to a similar conclusion as us. We have a few options here. Either accept that move
from crings will be invalid because our rule of zero compiler generated move constructor just completely thrashes our
classes invariance. We could allocate memory in the move constructor or make the class significantly more complicated
to support a no throw move. All of these options are pretty unattractive to me and they all stem from the fact that
there's an object left behind after move that we need to worry about at all. If the object just completely went away
after move, we wouldn't have to worry about reestablishing its valid state. Non-destructive moves are in direct
conflict with strong invariance, performance, and simplicity. Now, I want
to look at another example of a real type and a well-known and popular codebase that has a noble goal of having
a very strong invariant, but its parade gets rained on by this conflict between that strong invariant and move
semantics. So, I'm in the video game industry and I've done some work with Unreal Engine. Unreal has its own
implementations of a lot of things from the C++ standard library. And one reason is so that it can freely add non-standard extensions that it wants.
For example, the Unreal implementation of optional as of Unreal 5.4 actually does the thing I was talking about
earlier where it allows you to say, "Hey, here's a bit representation that is illegal for my type because of its
invariance, so I don't need it. So you can use it to mean an empty optional." And that lets T optional here work on
your type with no additional space overhead. Another thing Unreal provides is its own version of the standard smart
pointer library. It has types like T unique pointer. By the way, the Unreal naming convention is to start the names
of all class templates with a capital T. Um, so T unique pointer corresponds to the standard unique pointer with very
few differences. These both correspond to option box from Rust. It's an option
because Rust's box can never be null, but these unique pointers can. So to match that in Rust, we weaken that
non-null invariant by explicitly and externally wrapping the box in a layer of nullability using option. But Unreal
wants to play this non-null game too. They provide an alternative to unique pointer called unique obj which is
basically a unique pointer that is always nonnull. This is the equivalent of plain box from rust. The C++ standard
library doesn't have anything like this although there are a couple of closely related library components that have been proposed. You should read about
these if you're interested. One of the tricky things to figure out about their design is what to do about moves. Unique
Oz from Unreal has significant challenges with moves too, but we won't dive into those because unique OB isn't
actually super widely used and I have a different type I want to pick on instead in a moment. So, following suit with the
smart pointers we know and love, Unreal also provides an implementation of shared pointer. By default, this is just
like stood shared pointer or option arc from Rust. The reference count is atomic by default, although you can actually
specify as a template parameter that you'd prefer a non-atomic reference count if you don't need to send these
between threads since a non-atomic reference count is less expensive. There's no standard library smart
pointer that gives you a non-atomic reference count, but Rust has one called RC as opposed to arc, which is atomic.
And rounding out this smart pointer library is a type that I very much like more than shared pointer anyway. It's
called shared ref. And kind of like unique obj, it's a shared pointer that is never null. There's no standard
library equivalent, but in Rust, it's a bit like plain arc, no option. So let's
see what this type is all about. It's designed to interoperate with shared pointer wherever possible, but provides
stronger guarantees where they're available. So if I have a shared ref called ref, I can implicitly convert
that to a shared pointer. This makes sense from a type system perspective. It's not literally implemented this way,
but you can think of shared ref as a subtype of shared pointer because all shared refs are valid shared pointers,
but not all shared pointers are valid shared refs because they might be null. So converting from shared ref to shared
pointer is sort of an upcast. It goes from a more constrained type to a less constrained type, a stronger invariant
to a weaker invariant. So it can safely be done implicitly. The other direction is not safe in general. It's a downcast.
So it has to be done explicitly. And because it goes from a weaker guarantee to a stronger guarantee, it's possible
for it to go wrong. So there's an assertion in here that will fire if you try to turn a shared pointer that's
currently null into a shared ref. Doesn't work. Another thing I think is cool is that Unreal's make shared
actually returns a shared ref. Unreal's like we just allocated this. We know we have one. We know it's not null. So I'll
give you back a type with a strong guarantee about that. Of course, it's kind of ignoring that allocations can
fail. Such is life. But you'll often see code like this, and you might write this, especially if you're used to the
standard library where make shared returns a nullable pointer. This is fine. This just works because the shared
ref returned by make shared gets implicitly converted to a shared pointer for you. Let's think about this in light
of moves, though. First of all, I want to point out that especially if you're using atomic reference counting, you do want to avoid copying reference counted
pointers around. Here's an oversimplified diagram of shared pointer. You can see it's pointing to some ref count. And when we make a copy,
we have to increment that ref count. And then if we're just going to throw the source object away, we have to decrement that ref count. So we just pointlessly
incremented and then decremented our ref count. This is not only some atomic operations, but it could be a cache miss
when dreerencing the pointer to the control block that holds the ref count. So it's much better if we can just transfer the ref count using move. That
way we never have to visit the control block at all. But the question as always is what to do with the old value. For a
nullable shared pointer, we can just set the old value to null. But shared ref can't be null. So what do they do? Well,
the Unreal Engine source code is freely available. So let's take a look. First of all, when you look at shared ref,
you'll see a comment like this. It's not in the documentation. It's actually just inside the class body like this. It
says, "Shared ref has no default constructor, and you must initialize your shared ref to a valid object at
construction time. Now, it shouldn't surprise you to hear that I love this. I love that they force you to establish a
valid object so you don't have shared refs lying around that are halfbaked. Unfortunately, if you scroll down a bit,
you'll see there actually is a default constructor that's publicly accessible. It has a comment that says, "Don't use
it." I can only imagine that the big block comment is older and represents their intention. They later made the
painful decision to add a default constructor when they were facing some difficult problem. They either forgot to
update the comment or they just left it there because it's where their hearts are. Anyway, don't use this constructor.
Moving on. Share draft has the expected copy constructor and copy assignment operator which will increment the
reference count of the object we're pointing to. No surprises. Now, what about our move operations? Well, they've
done something clever for move assignment. With move assignment, you have two values to work with. Two values
that already exist in a valid state. So in order to efficiently move the source into the destination, they just swap the
internal pointers between source and destination. They don't have to update any reference counts. The destination
now points at what the source was pointing to, which is what we want assignment to do. And the source fulfills the post condition of being in
a valid but unspecified state. It's pointing to something else now, whatever the destination was pointing to before
the assignment. So that's clever and is more efficient than copy assignment. but move construction. There's nothing
clever to do here because we only have one value to work with, the source, and we have to leave the source in a valid
state, which is non-null. So, we have to just copy the source and increase our
ref count. Unreal provides this move constructor just for completeness, but all it does is copy. And there's a
comment in it explaining why. Seriously, go look at the comments in this code. They were thinking about this stuff. And
inside this function body, they explicitly acknowledge that move construction takes a hit here because of
the strong invariant of shared ref. On a similar note, let's look at shared pointer and its conversions to and from
shared ref. It has an implicit converting constructor from a const reference to shared ref. And in there,
there's another comment explaining again why there's no rvalue reference overload because we can't break shared ref's
invariant. On the other hand, when converting to a shared ref, shared pointer can be smart. It has a constre
qualified overload of the conversion that will bump the reference count and give you a new shared ref. But there's
also an rvalue qualified overload that moves the reference count into a new shared ref, leaving this null. And
shared pointer can do that precisely because of its weaker invariant. So you can see how there's this direct tension
between non-destructive moves and strong invariance. Let's go back and reason through this code. First of all, shoot.
We're accidentally using that default constructor we weren't supposed to use. This is one reason why it's not super effective to leave a comment saying not
to use a default constructor because the language calls default constructors for you a lot of the time. On the next line,
we are copying our shared ref into our shared pointer. So, we increase our ref count. On the next line, we convert our
pointer back to shared ref. This calls the const qualified version of two shared ref. But we can call the rv value
refqualified version by moving the pointer before calling the method. Move temp is Unreal's version of stood move.
It's basically the same except it static asserts that you aren't trying to move from const which I actually think is a
nice feature. Anytime I'm trying to move from const when I'm not in generic code, it's a mistake. So it's nice to be
alerted about it. Anyway, so we get a nice move here. Can't we just go up a couple lines and get a move here, too?
Well, no. Remember that wrapping ref in a call to move just casts it to an RV value, which would just encourage
overload resolution to prefer an RV value reference constructor. But there is no shared pointer converting
constructor that takes an RV value. So it still just falls back to the const LV value reference constructor. So copy is
the best we can do here. Our first make shared is fine. We're creating a shared ref. Our next one is a little
unfortunate. Initializing a shared pointer with the shared ref that is returned by make shared calls that copy
converting constructor. So we get an unnecessary increment of our ref count when we assign the temporary shared ref
into the shared pointer and then a decrement at the semicolon when the temporary shared ref is destroyed. So
this very commonplace looking code does something sort of inefficient every single time. And it's all because we
have to maintain the invariant of this value that's about to blip out of existence anyway. Contrast this with the
same situation in Rust. We have a non-null reference counted pointer and we can easily just move it somewhere
else because once we move out of the old value, it's gone. There's no invariant we have to keep up holding because no
one is ever going to look at that value again, including its own destructor, which will never run. There's not even
that much to say about this code except that it's really simple. There's no unnecessary reference count manipulation
despite the strong non-null invariant here with arc. That's because destructive moves work with strong
invariants whereas non-destructive moves work against them. This tension appears
in the standard library too. For example, here's a type with a very strong invariant. This is scoped lock
which is a newer version of lockguard which you might also know about. The invariant is very simple. While a scoped
lock exists, a mutex is locked. So we just know beyond a shadow of a doubt
that while we are in this scope, we are holding the lock. Scoped lock accomplishes this by just completely
disabling copy, which by default also disables move. So your scoped lock is nailed down to wherever you first create
it. There's no way to transfer the holding of this lock to another scope. Instead, if we want to move where we're
holding the lock, there's another type called unique lock that does support move. But look what else it supports. It
also supports unlocking. So, this type has a weaker invariant than scoped lock.
When you have a unique lock, you may or may not have a mutex locked. So, there's
more complexity when you reason about this type. And there's a shadow of a doubt when you see one in your code
about what state it's in. Now, I wasn't there when they designed this, but I suspect that what happened is that in
order to support move semantics, they needed unique lock to have an empty state so that a move from unique lock
would be in a valid state. So, they had to add unlocked to the possible valid
states that a unique lock could be in. Once they did that, they decided they might as well just let the user manually
put it into that state too by explicitly calling unlock. And the result is a type that's not really a lock. When you see a
unique lock, you may or may not have a lock. It's like an optional lock. And the tragedy here is that we already can
express an optional lock like this. We wrap this simple type with a strong
invariant in a wrapper optional that explicitly weakens its invariant on this
one axis. Now to unlock, we just destroy the scope lock that's inside the
optional. And to lock it again, we reconstruct the scope lock inside the optional. So we already have the tools
to express this, but this type still can't be moved because moving a stood optional requires being able to move the
inner type, which we can't do. So in order to support move, we can't wrap an empty state around our strong invariant.
We have to intrusively build an empty state into our types, which makes their invariance weaker and more complex. Here
are a bunch of types off the top of my head from the standard library that have an empty state built in. In all these
cases, we don't really have a thing. We have an optional thing, but the optional
is built into the type in a way that we can't strip off. That means we can't do the thing from the beginning of this
video. We check for null once and then strip off that layer of uncertainty by using a type with a stronger invariant.
If our API needs a STD function instead of a pointer, there's no way to encode in the type system whether this STD
function is allowed to be empty. We just have to check or assert or just cross our fingers and run the risk of a bad
function call exception. By the way, that means the compiler has to generate code for throwing that exception if it
can't prove that you already checked for null somewhere earlier in the call hierarchy. If there was a function type
that couldn't possibly be null, you wouldn't worry about it. The compiler wouldn't either. weaker invariance
systemically harm local reasoning, which hurts your code gen, not to mention your own ability to be sure that what you're
doing is correct. Notice I'm not saying, "Oops, this is bad because maybe we're going to pass a moved from object in
here." To which you could just reply, well, don't do that, and run a static analyzer and all that stuff. I'm not
saying that. I'm saying that needing to support a valid moved from state has infected the design of this class and
opened up that empty state as just a valid state that all stood functions could be in and it has a ripple effect
throughout every use of stood function even the ones that aren't moved from. There is a push in the C++ committee led
by Shaun Parent and others to weaken this guarantee to make it so that move from objects aren't necessarily in a
valid state. they're just in a state where you can destroy or reassign them. This mitigates the issue a bit. While I
don't love the idea that that means that a move from STID function is radioactive and possibly invalid, it would at least
mean hypothetically that I don't need to guard against empty functions in arbitrary APIs because I would know that
a valid stood function is not empty. If the caller passes me an empty one that
means they are definitely doing a use after move and that's their problem not mine. STD function itself would still
need to support an empty state internally somehow just for the move from case which is still unfortunate but
at least that weakened invariant doesn't infect your whole program just the places where you've moved a function. So
one last thing I want to mention here before we wrap up. We've talked about destructive moves where Russ just
memcopies your value and then doesn't run the destructor on the old memory location. Now, this is C++ where we're
supposed to have the power to open up the hood anytime we want. So, can we not just do this ourselves somehow? Can we
implement destructive moves on our end? Well, if you try to do this with variables with automatic storage
duration, like local variables on the stack, you're going to run into friction because the language calls your constructors and destructors in a way
that's hardwired. I'm not going to say it's impossible to do something very cursed to get something like destructive
moves for stack variables, but I discourage you from trying. But what if
you're writing some code that manually manages memory, such as a data structure like a vector? In that case, you're
probably manually invoking constructors and destructors anyway through placement new and placement delete. So, in that
case, you could definitely try to do this. It wouldn't save you from the weaker invariant stuff because your type would still need a traditional move
constructor for things like stack variables like I just said, but it could save you from having to actually move
your objects around between your vector buffers, for example, which entails writing empty state into the source
objects and then calling their destructors, which you know isn't going to do anything if they're moved from. So, it's a waste of time. So, this can
be a valuable optimization to try to exploit. In the C++ world, this memcopy and forget thing is known as relocation.
And a type where you can safely move it with a memcopy and forget is called trivially relocatable. It turns out that
the vast majority of types actually are trivially relocatable. The only time when you can't do it is if your type's
address is part of its state. In other words, if its location in memory appears in its bit representation in some way.
This can happen if you have a pointer back to yourself whether directly or indirectly. In this case, if your
address changes, you need to update the pointer to point to your new location. In other words, update your bit
representation to reflect the new address. So just memcopying will leave your value in an invalid state. But
again, most types don't have this problem. So they're safe to relocate. You can imagine a vector implementation
taking advantage of this. Now the standard library vector does not. There has been some work done in the committee
to try to get some version of relocatability standardized so that vector can take advantage of it, but for
now it doesn't. But other vector implementations do for example FB vector
from meta treats its data as trivially relocatable and get some nice performance gains out of that. In fact,
when you first plug in your type to FB vector, it will fail a static assertion. You actually have to specialize a type
trait in order to say I understand that my type needs to be trivially relocatable to work with FP vector and I
promise that it is. So you have to specifically sign off on this behavior before FP vector will agree to work with
your type. On the other hand, T array which is the vector from Unreal Engine just does this always without asking
you. They are betting on your type being trivially relocatable since most types are. And if you happen to try to use T
array with a type that is not trivially relocatable, you will spend your day debugging some weird stuff. You can ask
me how I know that. But it's interesting how these pieces fit together, isn't it? Picture a T array of T-shared ref.
Remember T-shared ref doesn't have traditional move operations because it doesn't have a valid empty state. But it
is trivially relocatable because it doesn't have any pointers back to itself. So a T array of T-shared ref
gets to magically move the shared refs around when it needs to without any unnecessary reference count
manipulation. The strong invariant of T-shared ref is not in conflict with
destructive moves only with non-destructive moves. So this is where I'll leave this discussion for today. I
want destructive moves in C++ so that I can write simple code with strong invariance and get the best performance
possible. I'm looking forward to hearing your thoughts in the comments. Let me know if you agree or disagree. And as always, I really appreciate you
watching. I hope I see you in the next one. And uh take care until then.
### [Youtube Link](https://www.youtube.com/watch?v=Klq-sNxuP2g)
